// 메모 기능 스크립트
document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("memo-title");
  const contentInput = document.getElementById("memo-content");
  const imageInput = document.getElementById("memo-image");
  const saveBtn = document.getElementById("save-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const searchInput = document.getElementById("search-input");
  const memoList = document.getElementById("memo-list");

  // 폴더 내비게이션 요소
  const folderNav = document.getElementById("folder-nav");
  const folderTitleDisplay = document.getElementById("folder-title-display");
  const backBtn = document.getElementById("back-btn");
  const newFolderBtn = document.getElementById("new-folder-btn");

  // 휴지통 관련 요소
  const trashBtn = document.getElementById("trash-btn");
  const trashModal = document.getElementById("trash-modal");
  const closeTrashBtn = document.getElementById("close-trash-btn");
  const trashList = document.getElementById("trash-list");
  const emptyTrashBtn = document.getElementById("empty-trash-btn");

  // 시계 요소
  const clockElement = document.getElementById("current-clock");

  let dragSrcEl = null; // 드래그 앤 드롭 소스 요소

  let editingIndex = -1; // 수정 중인 메모의 인덱스 (-1이면 새 메모)
  let currentFolderId = null; // 현재 보고 있는 폴더 ID (null이면 최상위)
  let folderHistory = []; // 폴더 탐색 기록

  // 재귀적으로 폴더 찾기
  function findFolderRecursive(items, id) {
    for (const item of items) {
      if (item.id === id && item.type === "folder") {
        return item;
      }
      if (item.type === "folder" && item.items) {
        const found = findFolderRecursive(item.items, id);
        if (found) return found;
      }
    }
    return null;
  }

  // 현재 컨텍스트(최상위 또는 특정 폴더)의 메모 리스트와 저장 함수 반환
  function getCurrentContext() {
    const allMemos = JSON.parse(localStorage.getItem("portfolio_memos")) || [];

    if (currentFolderId === null) {
      return {
        list: allMemos,
        save: () =>
          localStorage.setItem("portfolio_memos", JSON.stringify(allMemos)),
      };
    } else {
      const folder = findFolderRecursive(allMemos, currentFolderId);
      if (folder) {
        return {
          list: folder.items,
          save: () =>
            localStorage.setItem("portfolio_memos", JSON.stringify(allMemos)),
        };
      } else {
        // 폴더가 삭제되었거나 찾을 수 없는 경우 최상위로 복귀
        currentFolderId = null;
        folderHistory = [];
        return {
          list: allMemos,
          save: () =>
            localStorage.setItem("portfolio_memos", JSON.stringify(allMemos)),
        };
      }
    }
  }

  // 로컬 스토리지에서 메모 불러오기
  function loadMemos(query = "") {
    const { list: memos } = getCurrentContext();
    memoList.innerHTML = "";

    // 폴더 내비게이션 표시 여부 설정
    if (currentFolderId !== null) {
      folderNav.style.display = "flex";
      // 현재 폴더 이름 찾기
      const allMemos =
        JSON.parse(localStorage.getItem("portfolio_memos")) || [];
      const currentFolder = findFolderRecursive(allMemos, currentFolderId);
      folderTitleDisplay.textContent = currentFolder
        ? `📂 ${currentFolder.title}`
        : "폴더";
    } else {
      folderNav.style.display = "none";
    }

    if (memos.length === 0) {
      memoList.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; color: var(--secondary-text);">저장된 메모가 없습니다.</p>';
      return;
    }

    let hasVisibleMemos = false;

    // 저장된 순서대로 표시
    memos.forEach((memo, index) => {
      // 검색어가 있고, 제목에 검색어가 포함되지 않으면 건너뜀 (대소문자 무시)
      if (query && !memo.title.toLowerCase().includes(query.toLowerCase())) {
        return;
      }
      createMemoElement(memo, index);
      hasVisibleMemos = true;
    });

    if (!hasVisibleMemos && query) {
      memoList.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; color: var(--secondary-text);">검색 결과가 없습니다.</p>';
    }
  }

  // 메모 요소 생성 및 추가
  function createMemoElement(memo, index) {
    const div = document.createElement("div");
    div.className = "memo-item";

    // 폴더인 경우 다른 스타일 적용
    if (memo.type === "folder") {
      div.classList.add("folder-card");
      const folderColor = memo.color || "#ffd700";
      div.style.borderColor = folderColor;

      div.innerHTML = `
        <div class="folder-icon" style="filter: drop-shadow(0 2px 4px ${folderColor});">📁</div>
        <h3 style="color: ${folderColor}">${escapeHtml(memo.title)}</h3>
        <p>${memo.items.length}개의 항목</p>
        <div style="position: absolute; top: 15px; right: 15px; display: flex; gap: 5px; align-items: center;">
            <input type="color" value="${folderColor}" 
                   onclick="event.stopPropagation()" 
                   onchange="updateFolderColor(${index}, this.value)"
                   title="폴더 색상 변경"
                   style="width: 24px; height: 24px; border: none; background: none; cursor: pointer; padding: 0;">
            <button onclick="editMemo(${index})" style="background:none; border:none; color:var(--accent-color); cursor:pointer; font-size:1.2rem;">✎</button>
            <button onclick="deleteMemo(${index})" style="background:none; border:none; color:#ff5555; cursor:pointer; font-size:1.2rem;">&times;</button>
        </div>
      `;

      // 폴더 클릭 시 진입 이벤트 (버튼 및 입력 클릭 제외)
      div.addEventListener("click", (e) => {
        if (!e.target.closest("button") && !e.target.closest("input")) {
          openFolder(memo.id);
        }
      });
    } else {
      // 일반 메모인 경우
      div.innerHTML = `
              <h3>${escapeHtml(memo.title)}</h3>
              <button class="btn-edit" onclick="editMemo(${index})">✎</button>
              <button class="btn-delete" onclick="deleteMemo(${index})">&times;</button>
              ${memo.image ? `<img src="${memo.image}" class="memo-image-display" alt="메모 이미지">` : ""}
              <p>${escapeHtml(memo.content)}</p>
              <div class="memo-date">${memo.date}</div>
          `;

      // 더블 클릭으로 수정 모드 진입
      div.addEventListener("dblclick", (e) => {
        if (!e.target.closest("button")) {
          window.editMemo(index);
        }
      });
    }

    // 드래그 앤 드롭 속성 및 이벤트 추가
    div.setAttribute("draggable", true);
    div.dataset.index = index;
    div.addEventListener("dragstart", handleDragStart);
    div.addEventListener("dragover", handleDragOver);
    div.addEventListener("dragenter", handleDragEnter);
    div.addEventListener("dragleave", handleDragLeave);
    div.addEventListener("drop", handleDrop);
    div.addEventListener("dragend", handleDragEnd);

    memoList.appendChild(div);
  }

  // --- 드래그 앤 드롭 핸들러 ---
  function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
    this.classList.add("dragging");
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); // 드롭 허용
    }
    e.dataTransfer.dropEffect = "move";
    return false;
  }

  function handleDragEnter() {
    this.classList.add("over");
  }

  function handleDragLeave() {
    this.classList.remove("over");
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (dragSrcEl !== this) {
      const dragIndex = Number(dragSrcEl.dataset.index);
      const dropIndex = Number(this.dataset.index);

      const { list: currentList, save } = getCurrentContext();
      const dragItem = currentList[dragIndex];
      const dropItem = currentList[dropIndex];

      // 폴더 생성 및 이동 로직 (최상위 레벨에서만 허용하거나, 폴더 내 폴더 생성 방지 등 정책 결정)
      // 여기서는 간단하게:
      // 1. 폴더 위에 드롭 -> 폴더로 이동
      // 2. 메모 위에 메모 드롭 -> 새 폴더 생성하여 묶기

      if (dropItem.type === "folder" && dragItem.type !== "folder") {
        // 폴더에 메모 넣기
        if (
          confirm(
            `'${dragItem.title}' 메모를 '${dropItem.title}' 폴더로 이동하시겠습니까?`,
          )
        ) {
          dropItem.items.push(dragItem);
          currentList.splice(dragIndex, 1);
          save();
          loadMemos(searchInput.value);
          return false;
        }
      } else if (dropItem.type !== "folder" && dragItem.type !== "folder") {
        // 메모끼리 겹쳐서 새 폴더 생성 (최상위에서만 허용)
        if (confirm("두 메모를 포함하는 새 폴더를 만드시겠습니까?")) {
          const folderName = prompt("폴더 이름을 입력하세요:", "새 폴더");
          if (folderName) {
            const newFolder = {
              id: Date.now(),
              type: "folder",
              title: folderName,
              items: [dropItem, dragItem], // 드롭된 위치의 아이템과 드래그한 아이템
              date: new Date().toLocaleString(),
            };

            // 기존 아이템들 제거하고 그 위치에 폴더 삽입
            // 인덱스가 꼬이지 않게 큰 인덱스부터 처리하거나 로직 주의
            // 간단하게: 드래그 아이템 먼저 제거 -> 드롭 아이템 위치에 폴더로 교체

            currentList.splice(dragIndex, 1);
            // 드래그 아이템이 빠지면서 인덱스가 밀렸을 수 있으므로 dropItem의 새 인덱스 찾기
            const newDropIndex = currentList.indexOf(dropItem);
            currentList.splice(newDropIndex, 1, newFolder);

            save();
            loadMemos(searchInput.value);
            return false;
          }
        }
      }

      // 기본 동작: 순서 변경 (Reorder)
      const [movedItem] = currentList.splice(dragIndex, 1);
      currentList.splice(dropIndex, 0, movedItem);

      save();

      if (editingIndex !== -1) resetForm();
      loadMemos(searchInput.value);
    }
    return false;
  }

  function handleDragEnd() {
    this.classList.remove("dragging");
    document
      .querySelectorAll(".memo-item")
      .forEach((item) => item.classList.remove("over"));
  }

  // HTML 이스케이프 (XSS 방지)
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 폼 초기화 함수
  function resetForm() {
    titleInput.value = "";
    contentInput.value = "";
    imageInput.value = "";
    editingIndex = -1;
    saveBtn.textContent = "메모 저장하기";
    cancelBtn.style.display = "none";
  }

  // 검색 입력 이벤트
  searchInput.addEventListener("input", (e) => {
    loadMemos(e.target.value);
  });

  // 엔터키 저장 이벤트 추가
  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveBtn.click();
    }
  });

  contentInput.addEventListener("keydown", (e) => {
    // Ctrl + Enter 또는 Command + Enter 시 저장
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      saveBtn.click();
    }
  });

  // 메모 저장
  saveBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!title && !content && !imageFile) {
      alert("제목, 내용 또는 이미지를 입력해주세요.");
      return;
    }

    // 메모 저장 로직 (이미지 처리 포함)
    const saveMemoData = (base64Image) => {
      const { list: memos, save } = getCurrentContext();

      if (editingIndex >= 0) {
        // 수정 모드
        memos[editingIndex].title = title || "제목 없음";
        memos[editingIndex].content = content;
        memos[editingIndex].date = new Date().toLocaleString() + " (수정됨)";
        // 이미지가 새로 첨부되었다면 교체, 아니면 기존 유지
        if (base64Image) {
          memos[editingIndex].image = base64Image;
        }
      } else {
        // 새 메모 모드
        const newMemo = {
          id: Date.now(),
          title: title || "제목 없음",
          content: content,
          image: base64Image || null,
          date: new Date().toLocaleString(),
          type: "memo",
        };
        memos.unshift(newMemo); // 새 메모를 맨 앞에 추가
      }

      try {
        save();
      } catch (e) {
        alert("이미지 용량이 너무 커서 저장할 수 없습니다.");
        return;
      }

      resetForm();
      searchInput.value = ""; // 저장 시 검색어 초기화
      loadMemos();
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        saveMemoData(e.target.result); // 파일을 읽어서 Base64 문자열로 변환 후 저장
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveMemoData(null);
    }
  });

  // 취소 버튼 이벤트
  cancelBtn.addEventListener("click", () => {
    resetForm();
    searchInput.value = ""; // 취소 시 검색어 초기화
    loadMemos();
  });

  // 뒤로가기 버튼
  backBtn.addEventListener("click", () => {
    if (folderHistory.length > 0) {
      currentFolderId = folderHistory.pop();
    } else {
      currentFolderId = null;
    }
    loadMemos();
  });

  // 새 폴더 생성 버튼 이벤트
  if (newFolderBtn) {
    newFolderBtn.addEventListener("click", () => {
      const folderName = prompt("새 폴더의 이름을 입력하세요:");
      if (folderName && folderName.trim() !== "") {
        const { list: memos, save } = getCurrentContext();
        const newFolder = {
          id: Date.now(),
          type: "folder",
          title: folderName.trim(),
          items: [],
          color: "#ffd700", // 기본 색상
          date: new Date().toLocaleString(),
        };
        memos.unshift(newFolder);
        save();
        loadMemos();
      } else if (folderName !== null) {
        alert("폴더 이름은 비워둘 수 없습니다.");
      }
    });
  }

  // 폴더 열기 (전역 함수)
  window.openFolder = function (folderId) {
    folderHistory.push(currentFolderId);
    currentFolderId = folderId;
    loadMemos();
  };

  // --- 폴더 밖으로 이동 (상위 폴더로 드래그) ---
  folderNav.addEventListener("dragover", (e) => {
    e.preventDefault();
    folderNav.style.backgroundColor = "rgba(118, 74, 188, 0.2)";
    folderNav.style.borderRadius = "8px";
  });

  folderNav.addEventListener("dragleave", () => {
    folderNav.style.backgroundColor = "";
    folderNav.style.borderRadius = "";
  });

  folderNav.addEventListener("drop", (e) => {
    e.preventDefault();
    folderNav.style.backgroundColor = "";
    folderNav.style.borderRadius = "";

    if (!dragSrcEl || currentFolderId === null) return;

    const dragIndex = Number(dragSrcEl.dataset.index);
    const allMemos = JSON.parse(localStorage.getItem("portfolio_memos")) || [];

    const currentFolder = findFolderRecursive(allMemos, currentFolderId);
    if (!currentFolder) return;

    const [movedItem] = currentFolder.items.splice(dragIndex, 1);

    let parentList = allMemos;
    if (folderHistory.length > 0) {
      const parentId = folderHistory[folderHistory.length - 1];
      if (parentId !== null) {
        const parentFolder = findFolderRecursive(allMemos, parentId);
        if (parentFolder) parentList = parentFolder.items;
      }
    }

    parentList.push(movedItem);
    localStorage.setItem("portfolio_memos", JSON.stringify(allMemos));
    loadMemos(searchInput.value);
  });

  // --- 휴지통 기능 ---

  // 휴지통 열기
  trashBtn.addEventListener("click", () => {
    loadTrash();
    trashModal.classList.remove("hidden");
  });

  // 휴지통 닫기
  closeTrashBtn.addEventListener("click", () => {
    trashModal.classList.add("hidden");
  });

  // 모달 외부 클릭 시 닫기
  window.addEventListener("click", (e) => {
    if (e.target === trashModal) {
      trashModal.classList.add("hidden");
    }
  });

  // 휴지통 목록 불러오기
  function loadTrash() {
    const trash = JSON.parse(localStorage.getItem("portfolio_trash")) || [];
    trashList.innerHTML = "";

    if (trash.length === 0) {
      trashList.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; color: var(--secondary-text);">휴지통이 비어있습니다.</p>';
      return;
    }

    trash.forEach((memo, index) => {
      const div = document.createElement("div");
      div.className = "memo-item";
      div.style.opacity = "0.8"; // 삭제된 느낌

      div.innerHTML = `
              <h3>${escapeHtml(memo.title)}</h3>
              <div style="position: absolute; top: 15px; right: 15px; display: flex; gap: 10px;">
                  <button onclick="restoreMemo(${index})" title="복구" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">♻️</button>
                  <button onclick="deleteForever(${index})" title="영구 삭제" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color:#ff5555;">&times;</button>
              </div>
              ${memo.image ? `<img src="${memo.image}" class="memo-image-display" alt="메모 이미지">` : ""}
              <p>${escapeHtml(memo.content)}</p>
              <div class="memo-date">삭제됨: ${memo.deletedDate || memo.date}</div>
          `;
      trashList.appendChild(div);
    });
  }

  // 휴지통 비우기
  emptyTrashBtn.addEventListener("click", () => {
    if (confirm("휴지통을 비우시겠습니까? 모든 메모가 영구 삭제됩니다.")) {
      localStorage.removeItem("portfolio_trash");
      loadTrash();
    }
  });

  // 메모 복구 (전역 함수)
  window.restoreMemo = function (index) {
    const trash = JSON.parse(localStorage.getItem("portfolio_trash")) || [];
    const memos = JSON.parse(localStorage.getItem("portfolio_memos")) || [];

    const [restored] = trash.splice(index, 1);
    delete restored.deletedDate; // 삭제 날짜 제거
    memos.unshift(restored); // 메인 목록 맨 앞에 추가

    localStorage.setItem("portfolio_trash", JSON.stringify(trash));
    localStorage.setItem("portfolio_memos", JSON.stringify(memos));

    loadTrash();
    searchInput.value = ""; // 복구 시 전체 목록을 보기 위해 검색 초기화
    loadMemos();
  };

  // 영구 삭제 (전역 함수)
  window.deleteForever = function (index) {
    if (confirm("정말로 영구 삭제하시겠습니까? 복구할 수 없습니다.")) {
      const trash = JSON.parse(localStorage.getItem("portfolio_trash")) || [];
      trash.splice(index, 1);
      localStorage.setItem("portfolio_trash", JSON.stringify(trash));
      loadTrash();
    }
  };

  // 폴더 색상 변경 (전역 함수)
  window.updateFolderColor = function (index, color) {
    const { list: memos, save } = getCurrentContext();
    if (memos[index]) {
      memos[index].color = color;
      save();
      loadMemos(searchInput.value);
    }
  };

  // 전역 함수로 삭제 기능 노출
  window.deleteMemo = function (index) {
    if (confirm("이 메모를 휴지통으로 이동하시겠습니까?")) {
      const memoItem = document.querySelector(
        `.memo-item[data-index="${index}"]`,
      );

      const executeDelete = () => {
        const { list: memos, save } = getCurrentContext();
        const trash = JSON.parse(localStorage.getItem("portfolio_trash")) || [];

        if (index >= 0 && index < memos.length) {
          const [deletedMemo] = memos.splice(index, 1);
          deletedMemo.deletedDate = new Date().toLocaleString(); // 삭제 시점 기록
          trash.unshift(deletedMemo); // 휴지통 맨 앞에 추가

          localStorage.setItem("portfolio_trash", JSON.stringify(trash));
          save();

          // 만약 수정 중인 메모를 삭제했다면 폼 초기화
          if (index === editingIndex) {
            resetForm();
          }

          // 현재 검색어 상태 유지하며 목록 갱신
          loadMemos(searchInput.value);
        }
      };

      if (memoItem && trashBtn) {
        const trashRect = trashBtn.getBoundingClientRect();
        const memoRect = memoItem.getBoundingClientRect();
        const transX =
          trashRect.left +
          trashRect.width / 2 -
          (memoRect.left + memoRect.width / 2);
        const transY =
          trashRect.top +
          trashRect.height / 2 -
          (memoRect.top + memoRect.height / 2);

        memoItem.style.transition =
          "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease-in";
        memoItem.style.transformOrigin = "center";
        memoItem.style.zIndex = "1000";
        memoItem.style.pointerEvents = "none"; // 애니메이션 중 클릭 방지

        requestAnimationFrame(() => {
          memoItem.style.transform = `translate(${transX}px, ${transY}px) scale(0.1) rotate(720deg)`;
          memoItem.style.opacity = "0";
        });

        setTimeout(executeDelete, 600); // 애니메이션 시간과 맞춤
      } else {
        executeDelete();
      }
    }
  };

  // 전역 함수로 수정 기능 노출
  window.editMemo = function (index) {
    const { list: memos } = getCurrentContext();
    const memo = memos[index];

    titleInput.value = memo.title;
    contentInput.value = memo.content;
    // 이미지는 보안상 input type="file"에 값을 설정할 수 없으므로 유지됨을 가정

    editingIndex = index;
    saveBtn.textContent = "메모 수정완료";
    cancelBtn.style.display = "block";

    // 입력창으로 스크롤 이동
    document
      .querySelector(".memo-input-card")
      .scrollIntoView({ behavior: "smooth" });
  };

  // --- Hero 섹션 파티클 효과 ---
  const particleCanvas = document.getElementById("particle-canvas");
  if (particleCanvas) {
    const particleCtx = particleCanvas.getContext("2d");
    let particles = [];

    const resizeCanvas = () => {
      particleCanvas.width = particleCanvas.offsetWidth;
      particleCanvas.height = particleCanvas.offsetHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = "rgba(180, 140, 255, 0.7)";
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.1) this.size -= 0.02;
      }
      draw() {
        particleCtx.fillStyle = this.color;
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particleCtx.fill();
      }
    }

    const handleParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].size <= 0.1) {
          particles.splice(i, 1);
          i--;
        }
      }
    };

    const animateParticles = () => {
      particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      // 매 프레임마다 파티클을 2개씩 추가하여 더 풍성하게
      if (particles.length < 25) {
        particles.push(new Particle());
        particles.push(new Particle());
      }
      handleParticles();
      requestAnimationFrame(animateParticles);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animateParticles();
  }

  // --- 시계 기능 ---
  if (clockElement) {
    const updateClock = () => {
      const now = new Date();
      clockElement.textContent = now.toLocaleTimeString();
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // 초기 로드
  loadMemos();
});
