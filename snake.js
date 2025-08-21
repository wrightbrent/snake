// Get the canvas and context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
// Size of each grid cell
const grid = 20;
// Frame count for controlling speed
let count = 0;
// Snake array: each element is a segment (x, y)
let snake = [{x: 160, y: 160}];
// Snake velocity (dx, dy)
let dx = grid;
let dy = 0;
// Food position
let food = {x: 320, y: 320};

// Player score
let score = 0;

// Obstacles: array of {x, y} positions
let obstacles = [
  {x: 100, y: 100},
  {x: 200, y: 200},
  {x: 300, y: 100},
  {x: 100, y: 300}
];

// Returns a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Place food at a random position on the grid, avoiding obstacles and snake
function resetFood() {
  let valid = false;
  while (!valid) {
    food.x = getRandomInt(0, canvas.width / grid) * grid;
    food.y = getRandomInt(0, canvas.height / grid) * grid;
    // Check food is not on snake or obstacles
    valid = !snake.some(seg => seg.x === food.x && seg.y === food.y) &&
            !obstacles.some(obs => obs.x === food.x && obs.y === food.y);
  }
}

// Main game loop
function gameLoop() {
  // Schedule next frame
  requestAnimationFrame(gameLoop);
  // Slow down the game loop (run every 8th frame for 50% slower speed)
  if (++count < 8) return;
  count = 0;
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate new head position
  let head = {x: snake[0].x + dx, y: snake[0].y + dy};
  // Add new head to the front of the snake
  snake.unshift(head);

  // Check if snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    resetFood(); // Place new food
  } else {
    // Remove the tail if no food eaten
    snake.pop();
  }


  // Check for collision with walls, self, or obstacles
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    // Check if head collides with any body segment
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) ||
    // Check if head collides with any obstacle
    obstacles.some(obs => obs.x === head.x && obs.y === head.y)
  ) {
    alert('Game Over! Your score: ' + score);
    // Reset game state
    snake = [{x: 160, y: 160}];
    dx = grid;
    dy = 0;
    score = 0;
    resetFood();
    return;
  }

  // Draw obstacles
  ctx.fillStyle = 'gray';
  obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, grid, grid));

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, grid, grid);

  // Draw snake
  ctx.fillStyle = 'lime';
  snake.forEach(segment => ctx.fillRect(segment.x, segment.y, grid, grid));
}

// Listen for keyboard events to change snake direction
document.addEventListener('keydown', e => {
  // Prevent snake from reversing
  if (e.key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; }
  else if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; }
  else if (e.key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; }
  else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; }
});

// Start the game loop
requestAnimationFrame(gameLoop);
