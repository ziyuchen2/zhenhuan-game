(() => {
  const installRulePatch = () => {
    if (window.__gambleSkipPatched || typeof window.handleGamble !== 'function') return;

    window.__gambleSkipPatched = true;
    const originalHandleGamble = window.handleGamble;

    window.handleGamble = function(player) {
      if (player.isAI && !player._forceGamblePlay) {
        setTimeout(() => {
          const shouldPlay = player.silver >= 700
            ? Math.random() < 0.75
            : player.silver >= 350
              ? Math.random() < 0.5
              : Math.random() < 0.25;

          if (!shouldPlay) {
            addLog(`${player.emoji} ${player.name} 路过赌坊，没有下注。`);
            renderBoard();
            renderPlayerList();
            finishTurn();
            return;
          }

          player._forceGamblePlay = true;
          window.handleGamble(player);
        }, AI_DELAY.decision);
        return;
      }

      if (!player.isAI && !player._forceGamblePlay) {
        showModal('🎲', '叶澜依的赌坊', '叶澜依招呼你入局。你可以下注碰碰运气，也可以这回先不玩。', [
          {
            text: '赌一把',
            class: 'danger',
            action: () => {
              player._forceGamblePlay = true;
              closeModal();
              window.handleGamble(player);
            }
          },
          {
            text: '这次不赌，离开',
            class: 'secondary',
            action: () => {
              addLog(`${player.emoji} ${player.name} 路过赌坊，没有下注。`);
              closeModal();
              finishTurn();
            }
          }
        ]);
        return;
      }

      player._forceGamblePlay = false;
      originalHandleGamble(player);
    };
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installRulePatch, { once: true });
  } else {
    installRulePatch();
  }
})();
