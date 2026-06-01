"""
Chimera AI — Unified Academic Agent MCP Server
================================================
A FastMCP-powered server exposing three tools for academic calendar
management, notice processing (with Vision LLM), and study-priority
orchestration.  All persistent state lives in `academic_data.json`.

Run:
    python academic_agent_mcp.py          # stdio transport (default)
    fastmcp dev academic_agent_mcp.py     # MCP Inspector UI
"""

from __future__ import annotations

import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Literal

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field, field_validator
from fastmcp import FastMCP

# ──────────────────────────────────────────────
# 0.  Bootstrap
# ──────────────────────────────────────────────
load_dotenv()

DATA_FILE = Path(__file__).parent / "academic_data.json"

# Initialise the OpenAI-compatible client.
# Prefers OPENAI_API_KEY; falls back to Google Gemini's OpenAI compat endpoint.
_openai_key = os.getenv("OPENAI_API_KEY")
_google_key = os.getenv("GOOGLE_API_KEY")

if _openai_key:
    llm_client = OpenAI(api_key=_openai_key)
    VISION_MODEL = "gpt-4o"
elif _google_key:
    llm_client = OpenAI(
        api_key=_google_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    )
    VISION_MODEL = "gemini-2.5-flash"
else:
    raise EnvironmentError(
        "Set OPENAI_API_KEY or GOOGLE_API_KEY in your .env file."
    )

# ──────────────────────────────────────────────
# 1.  Pydantic Models
# ──────────────────────────────────────────────

class CalendarEvent(BaseModel):
    """A single academic calendar entry."""
    event_name: str = Field(..., min_length=1, description="Name of the event")
    date: str = Field(..., description="ISO-format date string (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)")
    category: Literal["Exam", "Deadline", "Other"] = Field(..., description="Event category")
    subject: str = Field(..., min_length=1, description="Related academic subject")

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        """Ensure the date string is parseable."""
        for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M"):
            try:
                datetime.strptime(v, fmt)
                return v
            except ValueError:
                continue
        raise ValueError(f"Date '{v}' is not valid ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)")


class NoticeResult(BaseModel):
    """Return type for the process_notice tool."""
    action_taken: str
    conflict_detected: bool
    details: str
    extracted_event: CalendarEvent | None = None


class AcademicData(BaseModel):
    """Root schema for academic_data.json."""
    calendar: list[CalendarEvent] = Field(default_factory=list)
    subject_priorities: dict[str, str] = Field(default_factory=dict)
    sprint_targets: dict[str, str] = Field(default_factory=dict)


# ──────────────────────────────────────────────
# 2.  Safe JSON I/O Utilities
# ──────────────────────────────────────────────

def _read_data() -> AcademicData:
    """Read and validate academic_data.json, creating it if missing."""
    if not DATA_FILE.exists():
        empty = AcademicData()
        _write_data(empty)
        return empty
    try:
        raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        return AcademicData.model_validate(raw)
    except (json.JSONDecodeError, Exception) as exc:
        print(f"⚠️  Warning: Could not parse {DATA_FILE}. Resetting. ({exc})")
        empty = AcademicData()
        _write_data(empty)
        return empty


def _write_data(data: AcademicData) -> None:
    """Atomically write data back to academic_data.json."""
    tmp = DATA_FILE.with_suffix(".tmp")
    try:
        tmp.write_text(
            json.dumps(data.model_dump(), indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        tmp.replace(DATA_FILE)
    except OSError as exc:
        print(f"❌ Failed to write {DATA_FILE}: {exc}")
        raise


# ──────────────────────────────────────────────
# 3.  Internal Helpers
# ──────────────────────────────────────────────

def _check_conflict(date_str: str, data: AcademicData) -> list[CalendarEvent]:
    """Return existing events that share the same calendar day."""
    try:
        new_day = date_str[:10]  # YYYY-MM-DD slice
    except Exception:
        return []
    return [evt for evt in data.calendar if evt.date[:10] == new_day]


def _set_priority(subject: str, priority: str, data: AcademicData) -> AcademicData:
    """Update a subject's priority in the data model."""
    data.subject_priorities[subject] = priority
    return data


def rebalance_sprint_targets() -> dict:
    """
    Zero-LLM deterministic engine to recalculate academic sprint targets.
    Checks the calendar for critical upcoming exams and re-balances hours and priority.
    """
    data = _read_data()
    from datetime import datetime
    now = datetime.now()
    
    updates = []
    
    for event in data.calendar:
        if event.category.lower() == "exam":
            try:
                event_date = datetime.strptime(event.date[:10], "%Y-%m-%d")
                days_left = (event_date - now).days
                
                # If an exam is within 14 days, it triggers a sprint rebalance
                if 0 <= days_left <= 14:
                    # Update priority to MAXIMUM
                    data.subject_priorities[event.subject] = "Maximum Priority"
                    
                    # Calculate targets (e.g. total 12 hours remaining, meaning 2 hours/day)
                    hours_required = max(12, days_left * 2) 
                    target_msg = f"{hours_required} hrs needed. Cover {max(1, hours_required//days_left if days_left>0 else hours_required)} ch/day before {event.date[:10]}"
                    data.sprint_targets[event.subject] = target_msg
                    
                    updates.append({"subject": event.subject, "new_priority": "Maximum Priority", "target": target_msg})
            except Exception:
                continue
                
    _write_data(data)
    return {"status": "success", "updates": updates, "all_targets": data.sprint_targets}


# ──────────────────────────────────────────────
# 4.  FastMCP Server & Tool Definitions
# ──────────────────────────────────────────────

mcp = FastMCP(
    "Chimera Academic Agent",
    instructions=(
        "You are the Unified Academic Agent for Chimera AI. "
        "You manage a student's academic calendar, extract events from "
        "notice images, detect scheduling conflicts, and automatically "
        "prioritise subjects when exams are detected."
    ),
)


@mcp.tool()
def process_notice(image_url: str) -> dict[str, Any]:
    """
    Process an academic notice image using a Vision LLM.

    Extracts event_name, date (ISO), category (Exam/Deadline/Other), and subject.
    Automatically checks for calendar conflicts and, if the event is an Exam,
    sets the subject to High Priority.

    Args:
        image_url: A public URL to the notice image, or a base64 data-URI
                   (e.g. data:image/png;base64,...).
    """
    # ── Step 1: Call Vision LLM ──────────────────────────
    system_prompt = (
        "You are an academic notice parser and student prioritizing assistant.\n"
        "Given an image of an academic notice, college event, exam announcement, or hackathon flyer, "
        "extract the fields and evaluate its URGENCY / PRIORITY. Return ONLY a JSON object:\n"
        '{\n'
        '  "event_name": "<string>",\n'
        '  "date": "<YYYY-MM-DD>",\n'
        '  "category": "Exam" | "Deadline" | "Other",\n'
        '  "subject": "<string>",\n'
        '  "priority": "High Priority" | "Medium" | "Low"\n'
        '}\n\n'
        "Urgency & Priority Mapping Guidelines:\n"
        "- 'High Priority': Major exams (Midterms, finals), high-stakes coding hackathons/contests, final project submissions, or extremely time-sensitive competitive events.\n"
        "- 'Medium': Weekly quizzes, standard lab assignments, routine syllabus revisions, and presentation deadlines.\n"
        "- 'Low': Seminars, guest lectures, club inaugurations, and voluntary workshops.\n\n"
        "Ensure the priority field is calculated intelligently based on the notice importance and wording. "
        "Always return valid JSON."
    )

    try:
        response = llm_client.chat.completions.create(
            model=VISION_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": image_url},
                        },
                        {
                            "type": "text",
                            "text": "Parse this academic notice, evaluate its urgency, and return the JSON.",
                        },
                    ],
                },
            ],
            temperature=0.1,
            max_tokens=2048,
        )
        raw_text = response.choices[0].message.content or ""
    except Exception as exc:
        return NoticeResult(
            action_taken="Vision LLM call failed",
            conflict_detected=False,
            details=f"Error contacting LLM: {exc}",
        ).model_dump()

    # ── Step 2: Parse LLM output into CalendarEvent ──────
    # Robustly extract JSON object from LLM output (handles fences, thinking, etc.)
    first_brace = raw_text.find("{")
    last_brace = raw_text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        cleaned = raw_text[first_brace : last_brace + 1]
    else:
        cleaned = re.sub(r"```(?:json)?\s*", "", raw_text).strip().rstrip("`")
    try:
        parsed = json.loads(cleaned)
        event = CalendarEvent.model_validate(parsed)
    except Exception as exc:
        return NoticeResult(
            action_taken="Failed to parse LLM output",
            conflict_detected=False,
            details=f"LLM returned: {raw_text!r}  |  Parse error: {exc}",
        ).model_dump()

    # ── Step 3: Conflict check ───────────────────────────
    data = _read_data()
    conflicts = _check_conflict(event.date, data)
    conflict_detected = len(conflicts) > 0
    conflict_names = ", ".join(c.event_name for c in conflicts) if conflicts else ""

    # ── Step 4: Auto-prioritise based on notice urgency ──
    extracted_priority = parsed.get("priority", "Medium")
    if extracted_priority not in ["High Priority", "Medium", "Low"]:
        extracted_priority = "High Priority" if event.category.lower() == "exam" else "Medium"
        
    data = _set_priority(event.subject, extracted_priority, data)
    priority_action = f" | Auto-set '{event.subject}' → {extracted_priority} based on task urgency."

    # ── Step 5: Save event to calendar ───────────────────
    data.calendar.append(event)
    _write_data(data)

    details_parts = [
        f"Extracted: {event.event_name} on {event.date} [{event.category}] for {event.subject}.",
    ]
    if conflict_detected:
        details_parts.append(f"⚠️  CONFLICT with: {conflict_names}.")
    if priority_action:
        details_parts.append(priority_action.strip(" | "))

    return NoticeResult(
        action_taken="Notice processed, event saved to calendar" + priority_action,
        conflict_detected=conflict_detected,
        details=" ".join(details_parts),
        extracted_event=event,
    ).model_dump()


@mcp.tool()
def manage_calendar(action: str, event_data: dict[str, Any] | None = None) -> dict[str, Any]:
    """
    Manage the academic calendar.

    Args:
        action: Either 'add' to insert a new event, or 'list' to retrieve all events.
        event_data: Required when action='add'. Dict with keys:
                    event_name, date (ISO), category (Exam/Deadline/Other), subject.
    """
    data = _read_data()

    if action == "list":
        events = [evt.model_dump() for evt in data.calendar]
        return {
            "action": "list",
            "count": len(events),
            "events": events,
            "subject_priorities": data.subject_priorities,
        }

    if action == "add":
        if not event_data:
            return {"error": "event_data is required for 'add' action."}
        try:
            event = CalendarEvent.model_validate(event_data)
        except Exception as exc:
            return {"error": f"Invalid event_data: {exc}"}

        # Conflict check
        conflicts = _check_conflict(event.date, data)
        conflict_detected = len(conflicts) > 0

        data.calendar.append(event)

        # Auto-prioritise exams
        if event.category.lower() == "exam":
            data = _set_priority(event.subject, "High Priority", data)

        _write_data(data)

        return {
            "action": "add",
            "event": event.model_dump(),
            "conflict_detected": conflict_detected,
            "conflicts_with": [c.event_name for c in conflicts] if conflicts else [],
        }

    return {"error": f"Unknown action '{action}'. Use 'add' or 'list'."}


@mcp.tool()
def update_study_priority(subject: str, priority: str) -> dict[str, str]:
    """
    Update the study priority for a given subject.

    Args:
        subject:  The academic subject name (e.g. 'Operating Systems').
        priority: The new priority level (e.g. 'High Priority', 'Medium', 'Low').
    """
    data = _read_data()
    old_priority = data.subject_priorities.get(subject, "Not Set")
    data = _set_priority(subject, priority, data)
    _write_data(data)
    return {
        "subject": subject,
        "old_priority": old_priority,
        "new_priority": priority,
        "status": "updated",
    }


# ──────────────────────────────────────────────
# 5.  Entry-point
# ──────────────────────────────────────────────
if __name__ == "__main__":
    print("🚀 Chimera Academic Agent MCP Server starting...")
    mcp.run()
