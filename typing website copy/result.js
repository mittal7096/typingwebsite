window.onload = function() {
    document.getElementById('result-wpm').textContent = sessionStorage.getItem('wpm');
    document.getElementById('result-accuracy').textContent = sessionStorage.getItem('accuracy');
    // Additional data can be displayed similarly
    // Optionally, draw a graph based on the typing performance data
};
