window.ThemeFruit = {
  draw: function (ctx, r, index, color) {
    ctx.save();
    if (index === 0) {
      // 체리 (꼭지)
      // 체리 모양 (하트형)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(-r * 0.2, 0, r * 0.8, 0, Math.PI * 2);
      ctx.arc(r * 0.2, 0, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
      // 꼭지
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.2);
      ctx.quadraticCurveTo(r * 0.2, -r * 1.0, r * 0.6, -r * 1.5);
      ctx.strokeStyle = "#795548";
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (index === 1) {
      // 딸기 (씨앗)
      // 딸기 모양 (둥근 역삼각형)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.2);
      ctx.quadraticCurveTo(0, -r * 1.2, r * 0.8, -r * 0.2);
      ctx.quadraticCurveTo(r * 0.5, r, 0, r * 1.1);
      ctx.quadraticCurveTo(-r * 0.5, r, -r * 0.8, -r * 0.2);
      ctx.fill();
      // 꼭지
      ctx.fillStyle = "#4CAF50";
      ctx.beginPath();
      ctx.moveTo(-r * 0.4, -r * 0.5);
      ctx.lineTo(r * 0.4, -r * 0.5);
      ctx.lineTo(0, -r * 0.2);
      ctx.fill();
      // 씨앗
      ctx.fillStyle = "#ffccbc";
      const seeds = [
        { x: 0, y: r * 0.1 },
        { x: -r * 0.3, y: -r * 0.2 },
        { x: r * 0.3, y: -r * 0.2 },
        { x: -r * 0.15, y: r * 0.4 },
        { x: r * 0.15, y: r * 0.4 },
      ];
      seeds.forEach((pos) => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (index === 2) {
      // 포도
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // 하이라이트
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.arc(-r * 0.3, -r * 0.3, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (index === 3) {
      // 한라봉
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // 꼭지 부분 튀어나옴
      ctx.beginPath();
      ctx.arc(0, -r * 0.8, r * 0.3, Math.PI, 0);
      ctx.fill();
      // 잎
      ctx.fillStyle = "#4CAF50";
      ctx.beginPath();
      ctx.ellipse(
        r * 0.2,
        -r * 0.9,
        r * 0.2,
        r * 0.1,
        -Math.PI / 4,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    } else if (index === 4) {
      // 오렌지
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // 질감 (점)
      ctx.fillStyle = "#F57C00";
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(
          Math.cos(ang) * r * 0.7,
          Math.sin(ang) * r * 0.7,
          2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    } else if (index === 5) {
      // 사과 (꼭지와 잎)
      // 사과 모양 (기본 원형 + 굴곡)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // 잎
      ctx.fillStyle = "#4CAF50";
      ctx.beginPath();
      ctx.ellipse(
        r * 0.2,
        -r * 0.9,
        r * 0.3,
        r * 0.15,
        -Math.PI / 4,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      // 꼭지
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.lineTo(0, -r * 1.1);
      ctx.strokeStyle = "#795548";
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (index === 6) {
      // 배
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // 점박이
      ctx.fillStyle = "#8D6E63";
      for (let i = 0; i < 8; i++) {
        const xOff = Math.cos(i * 2.5) * r * 0.7;
        const yOff = Math.sin(i * 2.5) * r * 0.7;
        ctx.beginPath();
        ctx.arc(xOff, yOff, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (index === 7) {
      // 복숭아
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // 골
      ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.9);
      ctx.quadraticCurveTo(r * 0.3, 0, 0, r * 0.9);
      ctx.stroke();
    } else if (index === 9) {
      // 멜론 (그물 무늬)
      // 기본 원형
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // 그물 무늬
      ctx.strokeStyle = "#C8E6C9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = -r; i < r; i += r * 0.5) {
        ctx.moveTo(i, -Math.sqrt(r * r - i * i));
        ctx.lineTo(i, Math.sqrt(r * r - i * i));
        ctx.moveTo(-Math.sqrt(r * r - i * i), i);
        ctx.lineTo(Math.sqrt(r * r - i * i), i);
      }
      ctx.stroke();
    } else if (index === 10) {
      // 수박 (줄무늬)
      // 기본 원형
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // 줄무늬
      ctx.strokeStyle = "#1B5E20";
      ctx.lineWidth = 4;
      ctx.beginPath();
      // 곡선 줄무늬
      ctx.moveTo(-r * 0.5, -r * 0.8);
      ctx.quadraticCurveTo(0, 0, -r * 0.5, r * 0.8);
      ctx.moveTo(r * 0.5, -r * 0.8);
      ctx.quadraticCurveTo(0, 0, r * 0.5, r * 0.8);
      ctx.moveTo(0, -r);
      ctx.lineTo(0, r);
      ctx.stroke();
    } else if (index === 8) {
      // 파인애플 (체크 무늬)
      // 기본 원형
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // 체크 무늬
      ctx.strokeStyle = "#F9A825";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = -r * 0.6; i < r * 0.6; i += r * 0.3) {
        ctx.moveTo(i, -Math.sqrt(r * r - i * i));
        ctx.lineTo(i, Math.sqrt(r * r - i * i));
        ctx.moveTo(-Math.sqrt(r * r - i * i), i);
        ctx.lineTo(Math.sqrt(r * r - i * i), i);
      }
      ctx.stroke();
      // 잎
      ctx.fillStyle = "#4CAF50";
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(-r * 0.2, -r * 1.3);
      ctx.lineTo(r * 0.2, -r * 1.3);
      ctx.fill();
    } else {
      // 그 외 과일 (기본 원형)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
