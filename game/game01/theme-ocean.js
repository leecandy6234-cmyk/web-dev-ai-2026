window.ThemeOcean = {
  draw: function (ctx, r, index) {
    // 눈 (검은 점)
    if (index % 2 === 0) {
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(-r * 0.2, -r * 0.1, r * 0.08, 0, Math.PI * 2);
      ctx.arc(r * 0.2, -r * 0.1, r * 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 자는 눈 (- -)
      ctx.strokeStyle = "#333";
      ctx.lineWidth = Math.max(2, r * 0.05);
      ctx.beginPath();
      ctx.moveTo(-r * 0.3, -r * 0.1);
      ctx.lineTo(-r * 0.1, -r * 0.1);
      ctx.moveTo(r * 0.1, -r * 0.1);
      ctx.lineTo(r * 0.3, -r * 0.1);
      ctx.stroke();
    }

    // 부리 (주황색 삼각형)
    ctx.fillStyle = "#FF9800";
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, 0);
    ctx.lineTo(r * 0.1, 0);
    ctx.lineTo(0, r * 0.15);
    ctx.fill();
  },
};
