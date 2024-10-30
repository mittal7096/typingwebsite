const submitButton = document.querySelector('.submit-button');
const progressBar = document.querySelector('.progress-bar');
const successMessage = document.querySelector('.success-message');

submitButton.addEventListener('click', () => {
    // Simulate a progress bar
    let progress = 0;
    const intervalId = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(intervalId);
            successMessage.textContent = 'Submission successful!';
        }
    }, 500);
});