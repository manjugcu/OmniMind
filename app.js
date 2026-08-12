/**
 * OmniMind AI — Next-Gen EdTech Multi-Agent Platform
 * Core Application Engine & Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let currentAgent = 'omnitutor';
    let quizCurrentIndex = 0;
    let quizQuestions = [];
    let quizSelectedAnswers = {};
    let competencyChartInstance = null;
    let revenueChartInstance = null;

    // --- Agent Database & Sample Prompts ---
    const agentsData = {
        omnitutor: {
            title: "OmniTutor AI — STEM & Math Specialist",
            role: "STEM & Math Specialist",
            icon: "fa-calculator",
            colorClass: "icon-cyan",
            systemMsg: "Hello! I'm OmniTutor AI. Ask me any calculus, physics, organic chemistry, or linear algebra problem!",
            prompts: [
                "Solve Integral of x * sin(x) dx step by step",
                "Explain Newton's Second Law with kinematic vector equations",
                "How do I balance a redox reaction in acidic solution?"
            ],
            responder: (query) => `<strong>Step-by-Step STEM Solution:</strong><br><br>
                1. <strong>Problem Formulation:</strong> Evaluate \\( \\int x \\sin(x) dx \\)<br>
                2. <strong>Integration by Parts Formula:</strong> \\( \\int u dv = uv - \\int v du \\)<br>
                3. Let \\( u = x \\implies du = dx \\), and \\( dv = \\sin(x) dx \\implies v = -\\cos(x) \\)<br>
                4. Substitute: \\( x(-\\cos(x)) - \\int -\\cos(x) dx \\)<br>
                5. Simplify: <strong>\\( -x \\cos(x) + \\sin(x) + C \\)</strong><br><br>
                <div style="background:rgba(6, 182, 212, 0.1); border-left:3px solid #06b6d4; padding:8px 12px; border-radius:4px;">
                💡 <em>OmniTutor Verification: Verified correct via Symbolic Computer Algebra Engine.</em>
                </div>`
        },
        verbamind: {
            title: "VerbaMind AI — Writing & Rhetoric Coach",
            role: "Writing & Rhetoric Coach",
            icon: "fa-pen-nib",
            colorClass: "icon-purple",
            systemMsg: "Greetings! I'm VerbaMind AI. Paste your essay draft, thesis statement, or abstract for real-time rhetorical analysis.",
            prompts: [
                "Critique my thesis statement: 'AI will replace traditional universities.'",
                "How to organize a 5-paragraph argumentative essay on climate tech?",
                "Suggest stronger academic verbs for a research paper intro."
            ],
            responder: (query) => `<strong>VerbaMind Rhetorical Analysis:</strong><br><br>
                • <strong>Thesis Strength:</strong> 7.5/10 (A bit absolute).<br>
                • <strong>Recommendation:</strong> Reframe absolute claims to nuanced academic statements.<br>
                • <strong>Suggested Revision:</strong> <em>"Generative AI will fundamentally restructure higher education models by shifting institutions from passive lecturing toward personalized multi-agent learning environments."</em><br><br>
                • <strong>Rhetorical Appeal:</strong> Enhances Ethos and Logos simultaneously.`
        },
        codecraft: {
            title: "CodeCraft AI — Coding & Software Mentor",
            role: "Coding & Software Mentor",
            icon: "fa-code",
            colorClass: "icon-emerald",
            systemMsg: "Hey coder! I'm CodeCraft AI. Share code snippets in Python, JavaScript, Rust, or C++ for debugging and time complexity analysis.",
            prompts: [
                "Write a Python function for Binary Search with O(log n) complexity",
                "Why am I getting 'TypeError: Cannot read properties of undefined' in JS?",
                "Explain the difference between Async/Await and Promises."
            ],
            responder: (query) => `<strong>CodeCraft Debug & Implementation:</strong><br><br>
<pre style="background:#111827; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); color:#10b981; font-family:monospace; font-size:0.85rem;">
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid # Target found at index
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1 # Target not in array

# Time Complexity: O(log n) | Space Complexity: O(1)
</pre><br>
💡 <em>Mentor Tip: Ensure input array is pre-sorted before calling Binary Search!</em>`
        },
        socratic: {
            title: "Socratic AI — Inquiry & Debate Partner",
            role: "Inquiry & Debate Partner",
            icon: "fa-lightbulb",
            colorClass: "icon-amber",
            systemMsg: "Welcome to Socratic Inquiry! I don't just give direct answers—I ask targeted questions to help you discover the core concept yourself.",
            prompts: [
                "Why does inflation rise when central banks print more money?",
                "Is artificial general intelligence (AGI) inherently conscious?",
                "What makes a scientific hypothesis falsifiable?"
            ],
            responder: (query) => `<strong>Socratic Discovery Inquiry:</strong><br><br>
                That is a fundamental question! Before we jump to conclusions, let's explore:<br><br>
                1. <em>If the total amount of goods and services in an economy stays constant, but the money supply doubles overnight, what happens to the scarcity value of each dollar?</em><br>
                2. <em>How do sellers adjust prices when buyers suddenly have twice as much currency competing for the same limited inventory?</em><br><br>
                👉 What do you think would happen to market equilibrium in that scenario?`
        },
        eduplan: {
            title: "EduPlan AI — Curriculum & Study Planner",
            role: "Curriculum & Study Planner",
            icon: "fa-compass",
            colorClass: "icon-rose",
            systemMsg: "Hi! I'm EduPlan AI. Tell me your academic goals or target exam date, and I'll construct a personalized milestone roadmap.",
            prompts: [
                "Create a 4-week study plan to master Machine Learning basics",
                "How can I balance 15 credit hours while preparing for GRE math?",
                "Identify my weak areas based on recent calculus quiz scores."
            ],
            responder: (query) => `<strong>EduPlan AI Personalized Roadmap:</strong><br><br>
                📅 <strong>4-Week Machine Learning Sprint:</strong><br>
                • <strong>Week 1:</strong> Linear Algebra (Vectors, Matrices, Eigenvalues) + Python NumPy<br>
                • <strong>Week 2:</strong> Regression & Classification Algorithms (Scikit-Learn)<br>
                • <strong>Week 3:</strong> Deep Neural Networks & Backpropagation (PyTorch)<br>
                • <strong>Week 4:</strong> Model Evaluation, Hyperparameter Tuning & Capstone Project<br><br>
                🎯 <em>Daily Target: 45 mins interactive OmniMind AI practice.</em>`
        },
        evalua: {
            title: "EvaluaAI — Teacher Studio & Assessor",
            role: "Teacher Studio & Assessor",
            icon: "fa-award",
            colorClass: "icon-blue",
            systemMsg: "Greetings Educator! I'm EvaluaAI. I assist with automated rubric grading, plagiarist detection, and custom quiz generation.",
            prompts: [
                "Grade a 300-word essay on AI in Education with detailed rubrics",
                "Generate a 5-question multiple choice quiz on Calculus derivatives",
                "Draft a constructive feedback summary for a struggling student."
            ],
            responder: (query) => `<strong>EvaluaAI Teacher Studio Assistant:</strong><br><br>
                To run an automated grading pass on your student submissions, scroll down to the <strong>Teacher Studio</strong> section below or click the <em>"Run EvaluaAI Instant Grading"</em> button!`
        }
    };

    // --- DOM Elements ---
    const agentsGrid = document.getElementById('agents-grid');
    const activeAgentTitle = document.getElementById('active-agent-title');
    const activeAgentAvatar = document.getElementById('active-agent-avatar');
    const samplePromptsBar = document.getElementById('sample-prompts-bar');
    const chatContainer = document.getElementById('chat-container');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const samplePromptBtn = document.getElementById('sample-prompt-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // --- Switch Active AI Agent ---
    function selectAgent(agentKey) {
        currentAgent = agentKey;
        const data = agentsData[agentKey];

        // Update card active classes
        document.querySelectorAll('.agent-card').forEach(card => {
            if (card.getAttribute('data-agent') === agentKey) {
                card.classList.add('active');
                if (!card.querySelector('.agent-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'agent-badge';
                    badge.textContent = 'Active';
                    card.appendChild(badge);
                }
            } else {
                card.classList.remove('active');
                const badge = card.querySelector('.agent-badge');
                if (badge) badge.remove();
            }
        });

        // Update Header & Avatar
        activeAgentTitle.textContent = data.title;
        activeAgentAvatar.className = `active-agent-avatar ${data.colorClass}`;
        activeAgentAvatar.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;

        // Update Sample Prompts
        samplePromptsBar.innerHTML = '';
        data.prompts.forEach(pText => {
            const chip = document.createElement('button');
            chip.className = 'prompt-chip';
            chip.textContent = pText;
            chip.addEventListener('click', () => {
                chatInput.value = pText;
                handleSendMessage();
            });
            samplePromptsBar.appendChild(chip);
        });

        // Add System welcome message
        chatContainer.innerHTML = `
            <div class="message message-system">
                <i class="fa-solid fa-robot"></i>
                <div class="message-bubble">
                    <strong>${data.role}:</strong> ${data.systemMsg}
                </div>
            </div>
        `;
    }

    // Attach click events to agent cards
    document.querySelectorAll('.agent-card').forEach(card => {
        card.addEventListener('click', () => {
            const agentKey = card.getAttribute('data-agent');
            selectAgent(agentKey);
        });
    });

    // Initialize default agent
    selectAgent('omnitutor');

    // --- Chat Send Handler ---
    function handleSendMessage() {
        const query = chatInput.value.trim();
        if (!query) return;

        // User message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'message message-user';
        userMsgDiv.innerHTML = `<div class="message-bubble">${escapeHtml(query)}</div>`;
        chatContainer.appendChild(userMsgDiv);

        chatInput.value = '';
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Simulate Agent Thinking & Response
        setTimeout(() => {
            const agentData = agentsData[currentAgent];
            const agentMsgDiv = document.createElement('div');
            agentMsgDiv.className = 'message message-agent';
            agentMsgDiv.innerHTML = `
                <div class="active-agent-avatar ${agentData.colorClass}" style="width:32px; height:32px; font-size:0.9rem;">
                    <i class="fa-solid ${agentData.icon}"></i>
                </div>
                <div class="message-bubble">${agentData.responder(query)}</div>
            `;
            chatContainer.appendChild(agentMsgDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 500);
    }

    sendChatBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    clearChatBtn.addEventListener('click', () => {
        selectAgent(currentAgent);
    });

    samplePromptBtn.addEventListener('click', () => {
        const prompts = agentsData[currentAgent].prompts;
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        chatInput.value = randomPrompt;
    });

    // Tool buttons helpers
    document.getElementById('latex-tool-btn').addEventListener('click', () => {
        chatInput.value += " \\int_{0}^{\\infty} e^{-x^2} dx ";
    });
    document.getElementById('code-tool-btn').addEventListener('click', () => {
        chatInput.value += " ```python\n# Paste snippet here\n``` ";
    });
    document.getElementById('voice-tool-btn').addEventListener('click', () => {
        chatInput.placeholder = "🎙️ Listening... Speak your problem now...";
        setTimeout(() => {
            chatInput.value = "Explain the difference between gradient descent and stochastic gradient descent.";
            chatInput.placeholder = "Ask your question or paste a problem here...";
        }, 1500);
    });

    // Helper: Escape HTML
    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // --- Theme Toggle ---
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggleBtn.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    });

    // --- Teacher Studio Auto-Grader ---
    const runGraderBtn = document.getElementById('run-grader-btn');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const resultContent = document.getElementById('result-content');

    runGraderBtn.addEventListener('click', () => {
        const topic = document.getElementById('essay-topic').value;
        const text = document.getElementById('essay-text').value;

        // Dynamic grading simulation
        const len = text.length;
        let score = Math.min(96, Math.max(70, Math.floor(len / 5) + 65));
        let letter = "Grade: A";
        if (score < 80) letter = "Grade: B";
        else if (score < 90) letter = "Grade: A-";

        document.getElementById('grade-score').textContent = `${score}/100`;
        document.getElementById('grade-letter').textContent = letter;

        document.getElementById('bar-clarity').style.width = `${Math.min(98, score + 3)}%`;
        document.getElementById('val-clarity').textContent = `${Math.min(98, score + 3)}%`;

        document.getElementById('bar-thesis').style.width = `${score}%`;
        document.getElementById('val-thesis').textContent = `${score}%`;

        document.getElementById('bar-evidence').style.width = `${Math.max(65, score - 7)}%`;
        document.getElementById('val-evidence').textContent = `${Math.max(65, score - 7)}%`;

        document.getElementById('bar-grammar').style.width = `${Math.min(99, score + 5)}%`;
        document.getElementById('val-grammar').textContent = `${Math.min(99, score + 5)}%`;

        document.getElementById('feedback-text').textContent = 
            `"EvaluaAI analyzed '${topic}'. Structural clarity is very high with clean thematic flow. Vocabulary exhibits academic rigor. Recommendation: Expand on institutional ethical frameworks to push score to 100%."`;

        resultPlaceholder.classList.add('hidden');
        resultContent.classList.remove('hidden');
    });

    // Studio Tabs Switcher
    document.querySelectorAll('.studio-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.studio-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.studio-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetId = `tab-${tab.getAttribute('data-tab')}`;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Quiz Generator Engine ---
    const generateQuizBtn = document.getElementById('generate-quiz-btn');
    const liveQuizCard = document.getElementById('live-quiz-card');
    const quizTitle = document.getElementById('quiz-title');
    const quizBody = document.getElementById('quiz-body');
    const prevQBtn = document.getElementById('prev-q-btn');
    const nextQBtn = document.getElementById('next-q-btn');
    const quizProgressText = document.getElementById('quiz-progress-text');

    const sampleQuizzes = {
        Calculus: [
            { q: "What is the derivative of f(x) = x^3 - 4x + 7?", options: ["3x^2 - 4", "3x^2 - 4x", "x^2 - 4", "6x - 4"], correct: 0 },
            { q: "Which theorem guarantees a zero derivative for a differentiable function with equal endpoints?", options: ["Mean Value Theorem", "Rolle's Theorem", "L'Hôpital's Rule", "Intermediate Value Theorem"], correct: 1 },
            { q: "Evaluate Integral of (1/x) dx for x > 0:", options: ["ln(x) + C", "1/x^2 + C", "e^x + C", "x ln(x) + C"], correct: 0 }
        ],
        Python: [
            { q: "Which data structure in Python is immutable?", options: ["List", "Dictionary", "Tuple", "Set"], correct: 2 },
            { q: "What is the time complexity of looking up a key in a Python dict on average?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correct: 0 },
            { q: "Which keyword is used for defining a generator function in Python?", options: ["return", "yield", "async", "lambda"], correct: 1 }
        ]
    };

    generateQuizBtn.addEventListener('click', () => {
        const subject = document.getElementById('quiz-subject').value;
        quizQuestions = sampleQuizzes[subject] || sampleQuizzes['Calculus'];
        quizCurrentIndex = 0;
        quizSelectedAnswers = {};

        quizTitle.textContent = `${subject} — Adaptive Live Quiz`;
        liveQuizCard.classList.remove('hidden');
        renderQuizQuestion();
    });

    function renderQuizQuestion() {
        const item = quizQuestions[quizCurrentIndex];
        quizProgressText.textContent = `Question ${quizCurrentIndex + 1} of ${quizQuestions.length}`;
        
        let html = `<h4 style="margin-bottom:16px;">Q${quizCurrentIndex + 1}: ${item.q}</h4>`;
        item.options.forEach((opt, idx) => {
            const selectedClass = quizSelectedAnswers[quizCurrentIndex] === idx ? 'selected' : '';
            html += `<button class="quiz-option-btn ${selectedClass}" data-opt="${idx}">${String.fromCharCode(65 + idx)}. ${opt}</button>`;
        });
        quizBody.innerHTML = html;

        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedOpt = parseInt(btn.getAttribute('data-opt'));
                quizSelectedAnswers[quizCurrentIndex] = selectedOpt;
                renderQuizQuestion();
            });
        });

        prevQBtn.disabled = quizCurrentIndex === 0;
        if (quizCurrentIndex === quizQuestions.length - 1) {
            nextQBtn.textContent = "Submit Quiz";
        } else {
            nextQBtn.textContent = "Next Question";
        }
    }

    prevQBtn.addEventListener('click', () => {
        if (quizCurrentIndex > 0) {
            quizCurrentIndex--;
            renderQuizQuestion();
        }
    });

    nextQBtn.addEventListener('click', () => {
        if (quizCurrentIndex < quizQuestions.length - 1) {
            quizCurrentIndex++;
            renderQuizQuestion();
        } else {
            // Calculate Quiz Results
            let score = 0;
            quizQuestions.forEach((q, idx) => {
                if (quizSelectedAnswers[idx] === q.correct) score++;
            });
            quizBody.innerHTML = `
                <div style="text-align:center; padding:20px;">
                    <i class="fa-solid fa-trophy" style="font-size:3rem; color:#f59e0b; margin-bottom:12px;"></i>
                    <h3>Quiz Completed!</h3>
                    <p style="font-size:1.3rem; margin:8px 0; color:#06b6d4;">Score: ${score} / ${quizQuestions.length} (${Math.round((score/quizQuestions.length)*100)}%)</p>
                    <p style="color:#9ca3af;">EduPlan AI has updated your skill radar matrix based on this test performance.</p>
                </div>
            `;
            prevQBtn.disabled = true;
            nextQBtn.textContent = "Retake Quiz";
            nextQBtn.onclick = () => generateQuizBtn.click();
        }
    });

    // --- Financial Projection Simulator Sliders ---
    const sliderSchools = document.getElementById('slider-schools');
    const sliderStudents = document.getElementById('slider-students');
    const valSchools = document.getElementById('slider-schools-val');
    const valStudents = document.getElementById('slider-students-val');
    const arrY1 = document.getElementById('arr-y1');
    const arrY3 = document.getElementById('arr-y3');

    function updateFinancials() {
        const schools = parseInt(sliderSchools.value);
        const students = parseInt(sliderStudents.value);

        valSchools.textContent = schools;
        valStudents.textContent = students.toLocaleString();

        // Formula: $35,000 per school/yr + $120 per student/yr
        const baseARR = (schools * 35000) + (students * 120);
        const y1Millions = (baseARR / 1000000).toFixed(1);
        const y3Millions = ((baseARR * 3.7) / 1000000).toFixed(1);

        arrY1.textContent = `$${y1Millions}M`;
        arrY3.textContent = `$${y3Millions}M`;

        if (revenueChartInstance) {
            revenueChartInstance.data.datasets[0].data = [
                (y1Millions * 0.4).toFixed(1),
                y1Millions,
                (y1Millions * 2.1).toFixed(1),
                y3Millions
            ];
            revenueChartInstance.update();
        }
    }

    sliderSchools.addEventListener('input', updateFinancials);
    sliderStudents.addEventListener('input', updateFinancials);

    // --- Initialize Charts ---
    function initCharts() {
        // Radar Chart: Cognitive Competency Matrix
        const ctxRadar = document.getElementById('competencyChart');
        if (ctxRadar) {
            competencyChartInstance = new Chart(ctxRadar, {
                type: 'radar',
                data: {
                    labels: ['STEM Solving', 'Writing & Syntax', 'Code Logic', 'Critical Inquiry', 'Curriculum Pace', 'Quiz Accuracy'],
                    datasets: [{
                        label: 'Student Skill Profile',
                        data: [92, 88, 95, 78, 85, 90],
                        backgroundColor: 'rgba(99, 102, 241, 0.25)',
                        borderColor: '#6366f1',
                        pointBackgroundColor: '#06b6d4',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: '#9ca3af', font: { size: 11 } },
                            ticks: { display: false, max: 100 }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // Line Chart: Financial Revenue Growth
        const ctxLine = document.getElementById('revenueChart');
        if (ctxLine) {
            revenueChartInstance = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['Q1 Launch', 'Year 1', 'Year 2', 'Year 3 Target'],
                    datasets: [{
                        label: 'ARR ($ Millions)',
                        data: [0.9, 2.4, 5.0, 8.9],
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.15)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
                        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } }
                    },
                    plugins: {
                        legend: { labels: { color: '#f9fafb' } }
                    }
                }
            });
        }
    }

    initCharts();
    updateFinancials();
});
