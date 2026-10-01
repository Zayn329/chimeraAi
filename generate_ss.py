from playwright.sync_api import sync_playwright

def generate_ss():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # 1. Landing Page
        page.goto("http://localhost:4173/")
        page.wait_for_timeout(1000)
        page.screenshot(path="ss/landing.png", full_page=False)

        # 2. Login Page
        page.goto("http://localhost:4173/login")
        page.wait_for_timeout(1000)
        page.screenshot(path="ss/login.png")

        # 3. Chat Window Page
        page.goto("http://localhost:4173/chat")
        page.wait_for_timeout(1000)
        page.screenshot(path="ss/chat.png")

        # 4. Document Ingestion Page
        page.goto("http://localhost:4173/ingest")
        page.wait_for_timeout(1000)
        page.screenshot(path="ss/ingest.png")

        # 5. Real-Time Telemetry & Flow Diagram Page
        page.goto("http://localhost:4173/telemetry")
        page.wait_for_timeout(1000)
        page.screenshot(path="ss/telemetry.png")

        browser.close()

if __name__ == "__main__":
    generate_ss()
