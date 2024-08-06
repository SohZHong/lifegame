document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions();
  });
  
  async function fetchQuestions() {
    try {
      const response = await fetch('/questions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const questions = await response.json();
      renderQuestions(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }
  
  function renderQuestions(questions) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = questions.map((question, index) => `
      <div key=${index + "qBlock"} class="qBlock">
        <h3>Question ${index + 1}</h3>
        <div class="btnBlock">
          <div class="theButtons">
            <button onclick="deleteQuestion(${question.question_id})">
              <img src="../../images/bin.png" alt="" class="delBtn">
            </button>
          </div>
        </div>
        <div key=${index + "quesBlock"} class="quesBlock">
          <p>${question.question}</p>
          <div class="ans">
            <table>
              <tr>
                <td>
                  <span class="correctiveIcon">
                    <img src="../../images/checked.png">
                    <p>${question.correct_ans}</p>
                  </span>
                </td>
                <td>
                  <span class="correctiveIcon">
                    <img src="../../images/cross.png">
                    <p>${question.incorrect_ans1}</p>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="correctiveIcon">
                    <img src="../../images/cross.png">
                    <p>${question.incorrect_ans2}</p>
                  </span>
                </td>
                <td>
                  <span class="correctiveIcon">
                    <img src="../../images/cross.png">
                    <p>${question.incorrect_ans3}</p>
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  async function deleteQuestion(question_id) {
    try {
      const response = await fetch('/deleteQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deleteQuiz: question_id })
      });
      const result = await response.json();
      alert(result.message);
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  }
  
  