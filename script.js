let username;
    let currentLevel = 1;
    let canvas, ctx;
    let isDrawing = false;
    let shapes = ['line', 'halfCircle', 'triangle'];

    function startGame() {
      username = document.getElementById('username').value;
      if (username.trim() !== '') {
        document.getElementById('name-form').style.display = 'none';
        document.getElementById('game-controls').style.display = 'block';
      } else {
        alert('Please enter your name.');
      }
    }

    function startLevel() {
      document.getElementById('game-controls').style.display = 'none';
      document.getElementById('canvas-container').style.display = 'block';
      canvas = document.getElementById('canvas');
      ctx = canvas.getContext('2d');
      drawShape(shapes[currentLevel - 1]);
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', drawLine);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
    }

    function drawShape(shape) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (shape === 'line') {
        // Draw a simple straight line
        ctx.beginPath();
        ctx.moveTo(100, 300);
        ctx.lineTo(700, 300);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 30; 
        ctx.stroke();
        // Draw start and end points inside the shape
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(100, 300, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(700, 300, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === 'halfCircle') {
        // Draw a half circle
        ctx.beginPath();
        ctx.arc(400, 200, 100, 0, Math.PI, false);
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 30; 
        ctx.stroke();
        // Draw start and end points inside the shape
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(400, 100, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(400, 300, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === 'triangle') {
        // Draw a triangle
        ctx.beginPath();
        ctx.moveTo(400, 100);
        ctx.lineTo(300, 300);
        ctx.lineTo(500, 300);
        ctx.closePath();
        ctx.strokeStyle = '#00f';
        ctx.lineWidth = 30; 
        ctx.stroke();
        // Draw start and end points inside the shape
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(400, 100, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(300, 300, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(500, 300, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function startDrawing(e) {
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    function drawLine(e) {
      if (!isDrawing) return;
      ctx.globalAlpha = 0.7; 
      ctx.strokeStyle = 'orange'; 
      ctx.lineWidth = 10;
      ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.stroke();
    }

    function stopDrawing() {
      isDrawing = false;
      checkOverlap();
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShape(shapes[currentLevel - 1]);
      document.getElementById('message').style.display = 'none';
    }

    function checkOverlap() {
      // Get the pixel data of the canvas
      let imageData = ctx.getImageData(100, 300, canvas.width, canvas.height);
      let data = imageData.data;

      // Check if all pixels are of the same color as the shape
      let isOverlap = true;
      for (let i = 0; i < data.length; i += 4) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        let alpha = data[i + 3];
        // Check if pixel is not transparent and is not the shape's color
        if (alpha !== 0 && (red !== 255 || green !== 0 || blue !== 0)) {
          isOverlap = false;
          break;
        }
      }

      // Show message and move to next level if overlap is successful
      if (isOverlap && currentLevel < shapes.length) {
        currentLevel++;
        alert('Congratulations! You completed the shape. Moving on to the next level.');
       
        clearCanvas();
      } else if (isOverlap && currentLevel === shapes.length) {
        alert('Congratulations, ' + username + '! You completed all levels of the game.');
        document.getElementById('game-controls').style.display = 'block';
        document.getElementById('canvas-container').style.display = 'none';
        currentLevel = 1; // Reset current level for next playthrough
      } else {
        document.getElementById('message').innerText = 'Try again! Draw the line over the shape.';
        document.getElementById('message').style.display = 'block';
        document.getElementById('message').style.color = 'black';


        // Clear the canvas and redraw the shape
        setTimeout(() => {
          clearCanvas();
        }, 1000); 
      }
    }