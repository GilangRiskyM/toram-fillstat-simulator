// Integration layer for the new UI with existing fillstat logic

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Add required hidden elements for compatibility
  const hiddenElements = [
    { id: "workbench", style: "display: none" },
    { id: "workspace", style: "display: none" },
    { id: "navigation_bar", style: "display: none" },
    { id: "rename_button", style: "display: none" },
    { id: "duplicate_button", style: "display: none" },
  ];

  hiddenElements.forEach((element) => {
    if (!document.getElementById(element.id)) {
      const div = document.createElement("div");
      div.id = element.id;
      div.style.cssText = element.style;
      document.body.appendChild(div);
    }
  });
});

// Override MainApp methods to work with new interface
if (typeof MainApp !== "undefined") {
  // Fix loadSettings to work with new element IDs
  MainApp.prototype.loadSettings = function () {
    let raw = localStorage.getItem("extra_settings");

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.log("No saved settings found or invalid JSON");
      return;
    }

    if (!data) return;

    // Map old element IDs to new ones
    const elementMap = {
      tec: "tec",
      proficiency: "proficiency",
      mat_reduction: "matReduction",
    };

    // Safely set values
    if (data.tec !== undefined) {
      const tecEl = document.getElementById(elementMap.tec);
      if (tecEl) tecEl.value = data.tec || 255;
    }

    if (data.proficiency !== undefined) {
      const profEl = document.getElementById(elementMap.proficiency);
      if (profEl) profEl.value = data.proficiency || 0;
    }

    if (data.mat_reduction !== undefined) {
      const matEl = document.getElementById(elementMap.mat_reduction);
      if (matEl) matEl.checked = data.mat_reduction || false;
    }
  };

  // Fix saveSettings to work with new element IDs
  MainApp.prototype.saveSettings = function (settings) {
    // If settings object is provided directly, use it
    if (settings && typeof settings === "object") {
      localStorage.setItem("extra_settings", JSON.stringify(settings));
      return;
    }

    // Otherwise, gather from form elements
    const elementMap = {
      tec: "tec",
      proficiency: "proficiency",
      mat_reduction: "matReduction",
    };

    const settingsData = {};

    const tecEl = document.getElementById(elementMap.tec);
    if (tecEl) settingsData.tec = parseInt(tecEl.value) || 255;

    const profEl = document.getElementById(elementMap.proficiency);
    if (profEl) settingsData.proficiency = parseInt(profEl.value) || 0;

    const matEl = document.getElementById(elementMap.mat_reduction);
    if (matEl) settingsData.mat_reduction = matEl.checked || false;

    localStorage.setItem("extra_settings", JSON.stringify(settingsData));
  };

  // Override loadFromStorage to handle missing elements gracefully
  const originalLoadFromStorage = MainApp.prototype.loadFromStorage;
  MainApp.prototype.loadFromStorage = function () {
    try {
      // Check if required elements exist before loading
      const requiredElements = [
        "starting_pot",
        "recipe_pot",
        "weap_arm",
        "tec",
        "proficiency",
      ];
      const missingElements = requiredElements.filter(
        (id) => !document.getElementById(id)
      );

      if (missingElements.length > 0) {
        return;
      }

      // Call original if all elements exist
      return originalLoadFromStorage.call(this);
    } catch (error) {
      return;
    }
  };

  // Override spawn to handle missing elements gracefully
  const originalSpawn = MainApp.prototype.spawn;
  MainApp.prototype.spawn = function (id) {
    try {
      // Check if required elements exist before spawning
      const requiredElements = ["starting_pot", "recipe_pot", "weap_arm"];
      const missingElements = requiredElements.filter(
        (elementId) => !document.getElementById(elementId)
      );

      if (missingElements.length > 0) {
        throw new Error(
          `Missing required elements: ${missingElements.join(", ")}`
        );
      }

      // Call original spawn
      return originalSpawn.call(this, id);
    } catch (error) {
      console.error("❌ Error in spawn:", error.message);
      throw error;
    }
  };
}

// Enhanced Stat class methods for better UI integration
if (typeof Stat !== "undefined") {
  // Override confirm to ensure final step is saved and displayed
  const originalConfirm = Stat.prototype.confirm;
  Stat.prototype.confirm = function () {
    // Call original confirm
    originalConfirm.call(this);

    // Force rebuild and update display regardless of finished status
    this.steps.buildCondensedFormula();
    this.updateFormulaDisplay();
  }; // Override loadDisplay to work with new interface
  Stat.prototype.loadDisplay = function () {
    let potential = `${this.future_pot} / ${this.pot}`;
    let success_rate = this.getSuccessRate();

    // Build slots HTML for the new interface
    let slotsHtml = "";
    for (let i = 0; i < 8; i++) {
      const options = this.buildStatOptions(i);

      slotsHtml += `
        <div class="slot-row">
          <div class="slot-number">${i + 1}</div>
          <select class="stat-select" id="slot${i}" onchange="App.getCurrent().slots[${i}].onUpdate()">
            <option value="0">PILIH STAT</option>
            ${options}
          </select>
          <input class="stat-input" autocomplete="off" type="text" maxlength="4" size="4" disabled id="input${i}" value="0" 
                 onkeydown="App.getCurrent().slots[${i}].onKeyPress(event)" 
                 oninput="App.getCurrent().slots[${i}].onUpdate()" style="color: blue">
          <span class="mat-cost" id="matcost${i}"></span>
        </div>
      `;
    }

    const slotsContainer = document.getElementById("slotsContainer");
    if (slotsContainer) {
      slotsContainer.innerHTML = slotsHtml;
    }

    // Update displays
    this.updatePotentialSuccessDisplay();
    this.updateMaterialCosts();
    this.updateFormulaDisplay();
    this.updateSettingsDisplay();
  };

  // Build stat options for dropdowns
  Stat.prototype.buildStatOptions = function (slotIndex) {
    if (typeof OPTIONS === "undefined" || !Array.isArray(OPTIONS)) {
      return '<option value="1" style="color: red;">Error: Stats data not loaded</option>';
    }

    let options = "";
    let lastCat = "";
    let catId = 0;

    for (let data of OPTIONS) {
      if (this.type === "a" && data.cat === "Awaken Elements") continue;

      if (lastCat !== data.cat) {
        options += `<option value="-1" disabled style="color: blue">&gt;-- ${data.cat} --&lt;</option>`;
        lastCat = data.cat;
      }

      catId++;
      options += `<option value="${catId}">${data.name}</option>`;
    }

    return options;
  };

  // Update potential and success rate display
  Stat.prototype.updatePotentialSuccessDisplay = function () {
    const potentialEl = document.getElementById("potentialDisplay");
    const successEl = document.getElementById("successRateDisplay");
    const confirmBtn = document.getElementById("confirmButton");

    if (potentialEl) {
      potentialEl.innerHTML = `Potential: ${this.future_pot} / ${this.pot}`;
    }

    if (successEl) {
      const rate = this.getSuccessRate();
      successEl.innerHTML = `Success Rate: ${rate}%`;

      // Change color based on success rate with CSS classes
      successEl.className = "success-rate";
      if (rate >= 80) {
        successEl.classList.add("high");
      } else if (rate >= 60) {
        successEl.classList.add("medium");
      } else {
        successEl.classList.add("low");
      }
    }

    if (confirmBtn) {
      confirmBtn.disabled = this.pot === this.future_pot;
    }
  };

  // Update material costs display
  Stat.prototype.updateMaterialCosts = function () {
    const tableBody = document.querySelector("#materialTable tbody");
    if (!tableBody) return;

    const materials = [
      { key: "Metal", display: "Metal / Logam" },
      { key: "Cloth", display: "Cloth / Kain" },
      { key: "Beast", display: "Beast / Fauna" },
      { key: "Wood", display: "Wood / Kayu" },
      { key: "Medicine", display: "Medicine / Obat" },
      { key: "Mana", display: "Mana" },
    ];
    let html = "";

    materials.forEach((mat) => {
      const amount = this.mats[mat.key] || 0;
      const color = amount > 0 ? "color: #27ae60; font-weight: bold;" : "";
      html += `<tr><td>${mat.display}</td><td style="${color}">${amount}</td></tr>`;
    });
    html += `<tr style="background-color: #f8f9fa;"><th>Max/Step</th><td style="font-weight: bold;">${this.max_mats}</td></tr>`;

    tableBody.innerHTML = html;
  };

  // Update formula display
  Stat.prototype.updateFormulaDisplay = function () {
    const formulaEl = document.getElementById("formulaDisplay");
    if (!formulaEl) return;

    console.log("🔧 updateFormulaDisplay called:");
    console.log("- steps.formula.length:", this.steps.formula.length);
    console.log(
      "- condensed_formula.length:",
      this.steps.condensed_formula.length
    );
    console.log("- finished:", this.finished);

    let display = this.steps.getDisplay();
    console.log("- display length:", display.length);

    if (typeof this.finished === "number") {
      display += `<br><br><strong>🎯 Final Result:</strong><br>`;
      display += `Success Rate: <span style="color: #27ae60; font-weight: bold;">${this.getSuccessRate()}%</span>`;

      if (this.tec !== 255) {
        display += ` <span style="color: #e74c3c; font-size: 12px">(${this.tec} TEC)</span>`;
      }

      const matsUsed = Object.keys(this.mats)
        .filter((mat) => this.mats[mat] > 0)
        .map((mat) => `${this.mats[mat]} ${mat}`)
        .join(" / ");

      if (matsUsed) {
        display += `<br><span style="color: #3498db; font-size: 12px">📦 Materials Used: ${matsUsed} (Max: ${this.max_mats})</span>`;
      }

      let settings = [];
      if (this.proficiency) settings.push(`${this.proficiency} proficiency`);
      if (this.mat_reduction) settings.push("10% mat reduction");
      if (settings.length) {
        display += `<br><span style="color: #27ae60; font-size: 12px">⚙️ Bonuses: ${settings.join(
          " + "
        )}</span>`;
      }
    }

    const content = `<strong>📊 Langkah-langkah:</strong><br><br>${
      this.type === "w" ? "⚔️ Weapon" : "🛡️ Armor"
    } - Starting Potential: ${this.starting_pot}<br><br>${
      display || "Belum ada langkah yang dilakukan."
    }`;
    formulaEl.innerHTML = content;

    // Update button states
    const redoBtn = document.getElementById("redoButton");
    const undoBtn = document.getElementById("undoButton");
    const repeatBtn = document.getElementById("repeatButton");

    if (redoBtn) redoBtn.disabled = !this.steps.redo_queue.length;
    if (undoBtn) undoBtn.disabled = !this.steps.formula.length;
    if (repeatBtn)
      repeatBtn.disabled = !this.steps.formula.length || !!this.finished;
  };

  // Update settings display (placeholder for future use)
  Stat.prototype.updateSettingsDisplay = function () {
    // This method exists for compatibility but we handle settings in the UI directly
  };

  // Override lockAllSlots to work with new button IDs
  Stat.prototype.lockAllSlots = function () {
    for (let slot of this.slots) {
      if (slot.lock) slot.lock();
    }

    // Use new button IDs instead of original ones
    const confirmBtn = document.getElementById("confirmButton");
    const repeatBtn = document.getElementById("repeatButton");

    if (confirmBtn) {
      confirmBtn.disabled = true;
    }

    if (repeatBtn) {
      repeatBtn.disabled = true;
    }
  }; // Override unlockAllSlots to work with new button IDs
  Stat.prototype.unlockAllSlots = function () {
    console.log("🔓 unlockAllSlots called - unlocking interface");
    for (let slot of this.slots) {
      if (slot.unlock) slot.unlock();
    }

    // Use new button IDs instead of original ones
    const confirmBtn = document.getElementById("confirmButton");
    const repeatBtn = document.getElementById("repeatButton");

    if (confirmBtn) {
      confirmBtn.disabled = false;
      console.log("✅ Confirm button enabled");
    }

    if (repeatBtn) {
      repeatBtn.disabled = false;
      console.log("✅ Repeat button enabled");
    }
  };
}

// Enhanced Steps class methods for better commit handling - check multiple possible class names
const StepsClasses = [
  typeof Steps !== "undefined" ? Steps : null,
  typeof window !== "undefined" && window.Steps ? window.Steps : null,
].filter((cls) => cls !== null);

if (StepsClasses.length > 0) {
  StepsClasses.forEach((StepsClass) => {
    if (StepsClass.prototype.commitChanges) {
      console.log("🔧 Setting up enhanced commitChanges for Steps class");

      // Store original commitChanges
      const originalCommitChanges = StepsClass.prototype.commitChanges;

      StepsClass.prototype.commitChanges = function () {
        console.log("🔧 Custom commitChanges() called");
        console.log(
          "🔍 Before commit - step_code_changes.length:",
          this.step_code_changes.length
        );
        console.log("🔍 Before commit - formula.length:", this.formula.length);

        // Call original commitChanges
        const result = originalCommitChanges.call(this);

        console.log("🔍 After commit - formula.length:", this.formula.length);
        console.log(
          "🔍 After commit - condensed_formula.length:",
          this.condensed_formula.length
        );
        console.log("✅ commitChanges completed");

        return result;
      };
    }
  });
}

// Enhanced Formula class for better display
if (typeof Formula !== "undefined") {
  Formula.prototype.getDisplay = function () {
    if (!this.condensed_formula.length) {
      return '<em style="color: #7f8c8d;">Belum ada langkah yang dilakukan.</em>';
    }

    const display = this.condensed_formula.map((step, index) => {
      const stepNum = `<strong style="color: #2c3e50;">#${index + 1}.</strong>`;
      const stepText = `<span style="color: #34495e;">${step.text}</span>`;
      const repeatText =
        step.repeat > 1
          ? ` <span style="color: #9b59b6;">(x${step.repeat})</span>`
          : "";
      const potText = `<span style="color: #7f8c8d; font-size: 12px;">(${step.pot_after} pot)</span>`;

      return `${stepNum} ${stepText}${repeatText} ${potText}`;
    });

    return display.join("<br>");
  };
}

// Add helper functions for UI interactions
window.confirmStep = function () {
  if (App && App.getCurrent()) {
    App.getCurrent().confirm();
  }
};

window.repeatStep = function () {
  if (App && App.getCurrent()) {
    App.getCurrent().repeat();
  }
};

window.undoStep = function () {
  if (App && App.getCurrent()) {
    App.getCurrent().undo();
  }
};

window.redoStep = function () {
  if (App && App.getCurrent()) {
    App.getCurrent().redo();
  }
};

// Auto-save functionality
let autoSaveInterval;
window.startAutoSave = function () {
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  autoSaveInterval = setInterval(() => {
    if (App) {
      App.saveToStorage();
    }
  }, 30000); // Auto-save every 30 seconds
};

window.stopAutoSave = function () {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
};

// Start auto-save when the page loads
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(startAutoSave, 1000);
});

// Utility function to show notifications
window.showNotification = function (message, type = "info") {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  switch (type) {
    case "success":
      notification.style.background = "#27ae60";
      break;
    case "error":
      notification.style.background = "#e74c3c";
      break;
    case "warning":
      notification.style.background = "#f39c12";
      break;
    default:
      notification.style.background = "#3498db";
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

// Add CSS animation for notifications
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
