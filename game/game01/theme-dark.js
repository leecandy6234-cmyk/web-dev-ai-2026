window.ThemeDark = {
  draw: function (ctx, r, index) {
    // 눈 (노란색)
    ctx.fillStyle = "#FFEB3B";
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
    ctx.arc(r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 눈동자 (세로로 찢어진 형태)
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(-r * 0.25, -r * 0.1, r * 0.05, r * 0.1, 0, 0, Math.PI * 2);
    ctx.ellipse(r * 0.25, -r * 0.1, r * 0.05, r * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // 눈썹 (화난 모양)
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.max(2, r * 0.05);
    ctx.beginPath();
    if (index % 2 === 0) {
      // 화난 눈썹
      ctx.moveTo(-r * 0.4, -r * 0.25);
      ctx.lineTo(-r * 0.1, -r * 0.1);
      ctx.moveTo(r * 0.4, -r * 0.25);
      ctx.lineTo(r * 0.1, -r * 0.1);
    } else {
      // 비웃는 눈썹 (짝짝이)
      ctx.moveTo(-r * 0.4, -r * 0.25);
      ctx.lineTo(-r * 0.1, -r * 0.1);
      ctx.moveTo(r * 0.4, -r * 0.15);
      ctx.lineTo(r * 0.1, -r * 0.25);
    }
    ctx.stroke();

    // 입 (삐죽)
    ctx.beginPath();
    ctx.arc(0, r * 0.1, r * 0.2, 0.8 * Math.PI, 0.2 * Math.PI);
    ctx.stroke();
  },
};
