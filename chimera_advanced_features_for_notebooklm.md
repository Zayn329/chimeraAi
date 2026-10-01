# Chimera AI Academic Assistant

## Proposed Advanced Features Case Study

### NotebookLM source document

This document describes proposed advanced features for the existing Chimera AI academic assistant. The presentation should describe these as planned enhancements or a proposed second phase. Do not present them as completed implementations.

The reference presentation, `AI_ADVANCED project.pptx`, uses an academic mini-project format with an institutional title slide, project motivation, technical approach, and a final conclusion. Create a similar formal academic deck, but keep the final presentation to 8 slides or fewer.

---

## 1. Existing project context

Chimera is an AI-powered academic assistant with these existing capabilities:

- Students can upload PDF notes or textbooks.
- Students can ask questions about an uploaded PDF.
- Teachers can upload `.txt` question banks containing questions and answers.
- Groq generates natural-language answers.
- Pinecone and embeddings support online semantic retrieval.
- TF-IDF and cosine similarity provide local offline retrieval.
- LangGraph routes queries to tutor, strategist, and bureaucrat agents.
- FastAPI provides backend endpoints.
- Streamlit provides the interface.
- Server-Sent Events display agent status and answer tokens as they arrive.
- Semantic caching reduces repeated online requests.

The existing system is primarily a document question-answering and academic retrieval application.

---

## 2. Proposed advanced features

The proposed features extend the existing project into an intelligent learning analytics and study-planning system.

### Feature 1: K-Means topic clustering

#### Purpose

Automatically group similar questions or PDF sections into topic clusters.

#### Example output

```text
Cluster 1: Search algorithms
Cluster 2: Machine learning
Cluster 3: Natural language processing
Cluster 4: Neural networks
```

#### How it fits the project

- Teacher uploads a question bank.
- The system converts questions into TF-IDF vectors or embeddings.
- K-Means groups similar questions.
- The teacher sees topic labels and cluster sizes.
- The student can revise one topic at a time.

#### Expected value

- Automatic organization of question banks.
- Discovery of major topics in a PDF.
- Better subject-wise revision planning.
- Detection of clusters with very few questions, which may indicate syllabus gaps.

#### AI Lab connection

Experiment 8: Clustering techniques using K-Means.

---

### Feature 2: Student performance prediction using regression

#### Purpose

Estimate a student’s likely performance from study and quiz activity.

#### Possible input features

- Quiz scores
- Number of questions attempted
- Correct-answer percentage
- Study sessions completed
- Topics revised
- Average response time
- Number of revision attempts

#### Example output

```text
Predicted score range: 72–78%
Priority topic: Classification algorithms
Recommended action: Complete one more practice quiz
```

#### How it fits the project

- The quiz module records student performance.
- A regression model uses historical activity as input.
- The prediction dashboard identifies topics that need revision.
- The tutor agent converts the result into a natural-language study recommendation.

#### Important limitation

The result should be presented as an estimate, not a guaranteed score. The model would require enough labelled student data before it could be considered reliable.

#### AI Lab connection

Experiment 6: Machine learning using regression.

---

### Feature 3: Adaptive quiz generation

#### Purpose

Generate a quiz that changes according to the student’s performance.

#### Workflow

```text
Uploaded PDF or question bank
        |
        v
Question extraction
        |
        v
Topic and difficulty classification
        |
        v
Personalized quiz
        |
        v
Performance analysis
        |
        v
Next quiz targets weak topics
```

#### Example behavior

- If the student performs well on basic questions, the system increases difficulty.
- If the student repeatedly misses NLP questions, the system recommends NLP revision.
- The next quiz contains more questions from weak topics.

#### AI Lab connection

Experiments 7, 9, and 10: classification, NLP application development, and AI mini-project work.

---

### Feature 4: Automatic question classification

#### Purpose

Assign topic and difficulty labels to teacher-uploaded questions.

#### Possible labels

- Topic: search, machine learning, NLP, databases, operating systems
- Difficulty: easy, medium, difficult
- Question type: definition, explanation, comparison, numerical, application

#### Proposed techniques

- TF-IDF features
- k-Nearest Neighbors for topic similarity
- Decision Tree for difficulty classification
- Groq for optional natural-language labeling support

#### AI Lab connection

Experiment 7: k-NN and Decision Tree classification.

---

### Feature 5: A* study-path planner

#### Purpose

Recommend an efficient learning path based on prerequisites and student weaknesses.

#### Example topic graph

```text
Python basics → Data structures → Machine learning → NLP → Generative AI
```

The student selects a goal such as “learn NLP.” A* searches the topic graph and selects a path using:

- Topic prerequisites
- Difficulty
- Estimated study time
- Student performance

#### Example output

```text
Recommended path:
1. Revise Python data handling
2. Review vectors and matrices
3. Study basic machine learning
4. Start NLP preprocessing
```

#### AI Lab connection

Experiment 3: Greedy Best-First Search and A* search.

---

### Feature 6: NLP preprocessing and keyword dashboard

#### Purpose

Provide a structured view of the important content in uploaded PDFs.

#### Possible outputs

- Tokenized text
- Important keywords
- Frequently occurring concepts
- Named entities
- Topic summaries
- Question candidates
- Prerequisite terms

#### How it fits the project

The existing PDF extraction and retrieval pipeline becomes the input to an NLP analysis layer. The student can inspect the document before asking questions.

#### AI Lab connection

Experiment 9: NLP and AI application development.

---

## 3. Proposed advanced architecture

```text
Student / Teacher
        |
        v
Streamlit interface
        |
        v
FastAPI service
        |
        +-----------------------+
        |                       |
        v                       v
Document and question bank   Quiz and activity data
processing                   collection
        |                       |
        v                       v
TF-IDF / embeddings          ML analytics layer
        |                       |
        +-----------+-----------+
                    |
                    v
        +---------------------------+
        | Advanced AI features     |
        | K-Means topic clustering  |
        | Regression prediction     |
        | Classification             |
        | Adaptive quizzes           |
        | A* study planning          |
        +---------------------------+
                    |
                    v
          Tutor and strategist agents
                    |
                    v
        Groq response + SSE streaming
```

---

## 4. Proposed technology additions

The existing technology stack remains useful. Proposed additions include:

- `scikit-learn` for K-Means, regression, classification, TF-IDF, and evaluation metrics.
- `pandas` for activity and quiz-performance data.
- `matplotlib` or Plotly for topic and performance visualizations.
- A lightweight local database such as SQLite for quiz attempts and student activity.
- NetworkX or a custom graph representation for the A* study planner.
- Existing Groq, LangGraph, Pinecone, Streamlit, and FastAPI components remain unchanged.

These are proposed implementation dependencies for a future phase, not claims about the current codebase.

---

## 5. AI Lab syllabus mapping

| AI Lab experiment | Proposed feature |
|---|---|
| Experiment 1 | Python AI environment and scikit-learn implementation |
| Experiment 3 | A* study-path planner |
| Experiment 6 | Student performance prediction using regression |
| Experiment 7 | Question classification using k-NN and Decision Trees |
| Experiment 8 | K-Means topic clustering |
| Experiment 9 | NLP preprocessing, document analysis, and adaptive quiz interface |
| Experiment 10 | Complete Chimera academic learning platform as an AI mini-project |

The strongest additions for a manageable case study are K-Means clustering, regression-based performance prediction, adaptive quizzes, and NLP document analysis.

---

## 6. Expected benefits

- The teacher receives an automatically organized question bank.
- The student receives a study plan based on actual weak areas.
- PDF content becomes easier to explore and revise.
- Quiz difficulty can adapt to the student.
- Performance trends become visible through charts.
- The project demonstrates more AI Lab algorithms than a standard chatbot.
- The existing retrieval and SSE features remain useful instead of being replaced.

---

## 7. Limitations and responsible use

- Regression needs enough historical data to produce meaningful estimates.
- K-Means clusters need interpretation because cluster names are not automatically meaningful.
- Classification accuracy depends on labelled training examples.
- Predicted scores should not be treated as official academic results.
- Student activity data requires privacy protection.
- The A* planner depends on a well-defined topic-prerequisite graph.

---

# Recommended slide deck

Create a formal academic mini-project presentation with 8 slides maximum.

## Slide 1: Title

**Chimera AI: Advanced Features for an Intelligent Academic Assistant**

Subtitle: Proposed extensions for topic discovery, performance analytics, and adaptive learning

Include placeholders for:

- Institution
- Department
- Student names and roll numbers
- Guide name

## Slide 2: Existing project and motivation

- Existing PDF question answering and teacher question-bank system
- Groq, Pinecone, TF-IDF, LangGraph, Streamlit, and SSE
- Need for better topic organization and student personalization

## Slide 3: Proposed advanced features

Present the main features:

- K-Means topic clustering
- Regression-based performance prediction
- Adaptive quiz generation
- Automatic question classification
- NLP keyword and topic dashboard
- A* study-path planning

## Slide 4: K-Means topic clustering

Show the flow:

```text
Questions or PDF chunks → TF-IDF/embeddings → K-Means → topic clusters
```

Explain how clustering organizes questions and identifies major topics.

## Slide 5: Regression and adaptive learning

- Show quiz and activity data as model inputs.
- Show predicted performance as an estimated output.
- Explain how the prediction feeds adaptive quiz recommendations.

## Slide 6: Advanced architecture

Use the proposed advanced architecture diagram from Section 3.

Show the connection between document processing, activity data, machine-learning models, agents, Groq, and SSE.

## Slide 7: AI Lab syllabus mapping

Use the compact mapping table from Section 5.

Highlight Experiments 3, 6, 7, 8, 9, and 10 as the main proposed coverage.

## Slide 8: Benefits, limitations, future scope, and conclusion

- Expected benefits
- Responsible-use limitations
- Future additions such as OCR, authentication, stronger evaluation, and multimodal document analysis
- Conclusion: Chimera can evolve from a document chatbot into a personalized academic learning platform.

---

## Suggested NotebookLM instruction

Create an 8-slide formal academic case-study presentation from this document. Use the existing Chimera project as the foundation and present K-Means topic clustering, regression-based performance prediction, adaptive quizzes, question classification, NLP analysis, and A* study planning as proposed advanced features. Clearly label these features as planned enhancements rather than completed functionality.

Use a visual style similar to a college AI mini-project presentation: clean institutional title slide, clear section headings, simple diagrams, concise bullet points, and a final conclusion slide. Include one architecture diagram, one K-Means workflow, one performance-prediction workflow, and one AI Lab syllabus-mapping table. Keep the deck to 8 slides maximum. Do not invent performance numbers, accuracy values, user counts, or implementation results.
