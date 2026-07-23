const stored = localStorage.getItem("questions")

let questions = stored ? JSON.parse(stored) : [
    {
        id: "q1",
        title: "What is your name?",
        description: "Enter your name here:",
        type: "short-text",
        required: true
    },
    {
        id: "q2",
        title: "Pick your favorite color",
        description: "What is your favorite color?",
        type: "multiple-choice",
        required: false,
        options: ["Red", "Blue", "Green", "Yellow"]
    }
];

let editID = null



function isValid(question) {
    if (question.title.trim() === "") {
        alert("Error: Please Enter a Title");
        return false;
    }
    if (question.type === "multiple-choice") {
        if (question.options.length < 2) {
            alert("Please provide at least 2 options")
            return false;
        }
    }
    return true
}

function moveQuestion(questions, index, direction) {
    const newIndex = index + direction;   // direction: -1 for up, +1 for down
    if (newIndex < 0 || newIndex >= questions.length) return;   // out of bounds, do nothing

    [questions[index], questions[newIndex]] = [questions[newIndex], questions[index]];
}


function renderInputField(labelText, value="") {
    const field = document.createElement("div");
    field.className = "field-row";

    const label = document.createElement("label")
    label.textContent = labelText;

    const userInput = document.createElement("input");
    userInput.type = "text";
    userInput.value = value;

    field.appendChild(label);
    field.appendChild(userInput);
    return field
}


function renderOptions(qOptions) {
    const myOptions = document.createElement("ul");
    qOptions.forEach((o, index) => {
        const option = document.createElement("li");
        option.className = "field-row"
        option.appendChild(renderInputField(`Option ${index + 1}:`, o));
        myOptions.appendChild(option);
    })
    return myOptions
}


function renderViewOptions(qOptions) {
    const myOptions = document.createElement("ul");
    qOptions.forEach((o, index) => {
        const option = document.createElement("li");
        option.textContent = `Option ${index + 1}: ${o}`
        myOptions.appendChild(option);
    })
    return myOptions
}


function renderRequiredBox(q) {
    const field = document.createElement("div");
    field.className = "field-row";

    const label = document.createElement("label")
    label.textContent = "Required";

    const userInput = document.createElement("input");
    userInput.type = "checkbox";
    userInput.checked = q.required;

    field.appendChild(label);
    field.appendChild(userInput);
    return field
}


function renderDropdown(options) {
    const newQuestionDropdown = document.createElement("select");
    options.forEach((o) => {
        const option = document.createElement("option")
        option.textContent = o
        newQuestionDropdown.appendChild(option)})
    return newQuestionDropdown
}


function renderNewQuestion(questions) {
    const block = document.createElement("div")

    const newQuestionButton = document.createElement("button");
    newQuestionButton.textContent = "New Question";
    newQuestionButton.className = "basic-button"
    newQuestionButton.addEventListener("click", () => {
        addQuestion(questions)
        })
    block.appendChild(newQuestionButton)
    document.body.appendChild(block)
}
    
   


function addQuestion(questions) {
    renderQuestions(questions)
    const newQuestionDropdown = renderDropdown(["select", "short-text", "multiple-choice"])
    newQuestionDropdown.addEventListener("change", () => {
            if (newQuestionDropdown.value === "short-text") collectShortText(questions)
            else collectMultipleChoice(questions)
            newQuestionDropdown.remove()
})
    document.body.appendChild(newQuestionDropdown)
    }
   

function collectShortText(questions) {
    const shortTextQuestion = document.createElement("div");
    shortTextQuestion.className = "question-block";

    const textField = renderInputField("Enter Question Title:");
    const requiredField = renderRequiredBox({ required: false });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Save";
    submitButton.className = "basic-button"
    submitButton.addEventListener("click", () => {
        const userInput = textField.querySelector("input");
        const requiredInput = requiredField.querySelector("input");


        const newQuestion = {
            id: `q${Date.now()}`,
            title: userInput.value,
            type: "short-text",
            required: requiredInput.checked
        };
        
        if (isValid(newQuestion) !== true) return;
        questions.push(newQuestion);
        renderQuestions(questions);
        renderNewQuestion(questions);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "basic-button"
    deleteButton.textContent = "Cancel";
    deleteButton.addEventListener("click", () => {
        renderQuestions(questions);
        renderNewQuestion(questions)
    });

    shortTextQuestion.appendChild(textField);
    shortTextQuestion.appendChild(requiredField);
    shortTextQuestion.appendChild(submitButton);
    shortTextQuestion.appendChild(deleteButton);
    document.body.appendChild(shortTextQuestion);
}

function collectMultipleChoice (questions) {
    const shortTextQuestion = document.createElement("div");
    shortTextQuestion.className = "question-block";

    const textField = renderInputField("Enter Question Title:");
    const requiredField = renderRequiredBox({ required: false });

    const options = renderOptions(["", "", "", ""])


    const submitButton = document.createElement("button");
    submitButton.className = "basic-button"
    submitButton.textContent = "Save";
    submitButton.addEventListener("click", () => {
        const userInput = textField.querySelector("input");
        const requiredInput = requiredField.querySelector("input");
        const parsedOptions = []
        options.querySelectorAll("input").forEach((o) => {
            if (o.value.trim() !== "") parsedOptions.push(o.value)
        })

        const newQuestion = {
            id: `q${Date.now()}`,
            title: userInput.value,
            type: "multiple-choice",
            required: requiredInput.checked,
            options: parsedOptions,
        };
        if (isValid(newQuestion) !== true) return;
        questions.push(newQuestion);
        renderQuestions(questions);
        renderNewQuestion(questions);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "basic-button"
    deleteButton.textContent = "Cancel";
    deleteButton.addEventListener("click", () => {
        renderQuestions(questions);
        renderNewQuestion(questions)
    });

    shortTextQuestion.appendChild(textField);
    shortTextQuestion.appendChild(options);
    shortTextQuestion.appendChild(requiredField);
    shortTextQuestion.appendChild(submitButton);
    shortTextQuestion.appendChild(deleteButton);
    document.body.appendChild(shortTextQuestion);
}


function renderQuestions(questions) {
    document.body.innerHTML = "";
    if (questions.length < 1) renderNewQuestion(questions);
    else {
        questions.forEach((q, index) => {
            if (q.id === editID) {
                const block = document.createElement("div");
                block.className = "question-block";


                const upButton = document.createElement("button")
                upButton.textContent = "^"
                upButton.className = "move-button"
                upButton.addEventListener("click", () => {
                    moveQuestion(questions, index, -1)
                    renderQuestions(questions)
                    renderNewQuestion(questions)
                })


                const heading = document.createElement("p");
                const headingEditField = renderInputField("Question Title:", q.title);
                heading.appendChild(headingEditField);

                const questionText = document.createElement("p");
                const questionEditField = renderInputField("Question:", q.description);
                questionText.appendChild(questionEditField);

                const requiredBox = renderRequiredBox(q);

                // capture the options field reference so Save can reach into it later
                const optionsField = q.type === "multiple-choice" ? renderOptions(q.options) : null;

                const submitButton = document.createElement("button");
                submitButton.className = "basic-button";
                submitButton.textContent = "Save";
                submitButton.addEventListener("click", () => {
                    // assign new values FIRST, so validation checks what's actually about to be saved
                    const oldTitle = q.title;
                    const oldDescription = q.description;
                    const oldRequired = q.required;
                    if (q.type === "multiple-choice") {
                        const oldChoices = q.options;
                    }
                    q.title = headingEditField.querySelector("input").value;
                    q.description = questionEditField.querySelector("input").value;
                    q.required = requiredBox.querySelector("input").checked;

                    if (q.type === "multiple-choice") {
                        const parsedOptions = [];
                        optionsField.querySelectorAll("input").forEach((o) => {
                            if (o.value.trim() !== "") parsedOptions.push(o.value);
                        });
                        q.options = parsedOptions;
                    }

                    if (isValid(q) !== true) {
                        q.title = oldTitle;
                        q.description = oldDescription;
                        q.required = oldRequired;
                        if (q.type === "multiple-choice") q.options = oldChoices;
                        return;
                    }

                    editID = null;
                    renderQuestions(questions);
                    renderNewQuestion(questions);
                });

                const cancelButton = document.createElement("button");
                cancelButton.className = "basic-button";
                cancelButton.textContent = "Cancel";
                cancelButton.addEventListener("click", () => {
                    editID = null;
                    renderQuestions(questions);
                    renderNewQuestion(questions);
                });

                const downButton = document.createElement("button")
                downButton.textContent = "v"
                downButton.className = "move-button"
                downButton.addEventListener("click", () => {
                    moveQuestion(questions, index, 1)
                    renderQuestions(questions)
                    renderNewQuestion(questions)
                })

                block.appendChild(upButton)
                block.appendChild(heading);
                block.appendChild(questionText);
                if (q.type === "multiple-choice") block.appendChild(optionsField);
                block.appendChild(requiredBox);
                block.appendChild(submitButton);
                block.appendChild(cancelButton);
                block.appendChild(downButton)

                document.body.appendChild(block);
            } else {
                const block = document.createElement("div");
                block.className = "question-block";

                const upButton = document.createElement("button")
                upButton.textContent = "^"
                upButton.className = "move-button"
                upButton.addEventListener("click", () => {
                    moveQuestion(questions, index, -1)
                    renderQuestions(questions)
                    renderNewQuestion(questions)
                })

                const heading = document.createElement("h1");
                heading.textContent = q.title;

                const questionText = document.createElement("p");
                questionText.textContent = q.description;

                const requiredBox = renderRequiredBox(q);
                requiredBox.querySelector("input").disabled = true;

                const editButton = document.createElement("button");
                editButton.className = "basic-button";
                editButton.textContent = "Edit";
                editButton.addEventListener("click", () => {
                    editID = q.id;
                    renderQuestions(questions);
                });

                const downButton = document.createElement("button")
                downButton.textContent = "v"
                downButton.className = "move-button"
                downButton.addEventListener("click", () => {
                    moveQuestion(questions, index, 1)
                    renderQuestions(questions)
                    renderNewQuestion(questions)
                })

                block.appendChild(upButton)
                block.appendChild(heading);
                block.appendChild(questionText);
                if (q.type === "multiple-choice") block.appendChild(renderViewOptions(q.options));
                block.appendChild(requiredBox);
                block.appendChild(editButton);
                block.appendChild(downButton)

                document.body.appendChild(block);
            }
        });

        localStorage.setItem("questions", JSON.stringify(questions));
    }
}



renderQuestions(questions)
renderNewQuestion(questions)

/*

questions.forEach((q) => {  //similar to a for loop
    console.log(q.text)
})


const titles = questions.map((q) => q.type);  //creates a brand new array of copied values
console.log(titles);


const requiredQuestions = questions.filter((q) => q.required === true); //notice three equal signs
console.log(requiredQuestions)

referencing an object assigns that object to the reference, and is mutable afterwards
referencing anything else copies the value, and assigns it to the reference, and the things are
seperate afterwards

const requiredTypes =  questions 
    .filter((q) => q.required === false)
    .map((q) => q.text)

heading.textContent            // read the text inside it
heading.textContent = "New Title";  // change it — page updates immediately

input.value                     // for form inputs specifically — what the user typed
input.value = "prefilled text"; // set it programmatically

block.hidden                    // read the hidden attribute — true/false
block.hidden = true;             // set it — element disappears from the page

event listeners:

button.addEventListener("click", (event) => {
    console.log(event.target);   // the exact element that was clicked
});

    "click" — buttons, or really any element
    "input" — fires on every keystroke in a text input (live updates as the user types)
    "change" — fires when a checkbox/select's value changes and loses focus

event.target: super useful. Holds the name of the element that was triggered

*/