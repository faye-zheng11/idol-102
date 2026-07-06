// 提示语 ZH|EN 逐条独立切换：每条 prompt 有自己的 .plang 开关，只切换该条对应的 <pre>。
// 每条有 zh/en 两版；原文=as-in-code，另一语=参考译文（reference）。默认显示中文。
(function () {
  // 设定某条 prompt（其 caption 为 rb）显示的语言：只影响该 rb 之后紧邻的 .v 兄弟 <pre>。
  function setBlock(rb, lang) {
    var native = rb.getAttribute('data-native') || 'zh';
    var n = rb.nextElementSibling;
    while (n && n.classList && n.classList.contains('v')) {
      n.style.display = (n.getAttribute('data-lang') === lang) ? 'block' : 'none';
      n = n.nextElementSibling;
    }
    rb.querySelectorAll('.plang button').forEach(function (b) {
      var on = b.getAttribute('data-set') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var v = rb.querySelector('.var');
    if (v) {
      var isSrc = native === lang;
      v.textContent = isSrc ? '原文 · as-in-code' : '参考译文 · reference';
      v.classList.toggle('src', isSrc);
      v.classList.toggle('ref', !isSrc);
    }
  }

  // 初始：每条默认中文（与 CSS 默认一致），并回填原文/译文标签与开关高亮。
  document.querySelectorAll('.rb[data-native]').forEach(function (rb) {
    setBlock(rb, 'zh');
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.plang button');
    if (!b) return;
    var rb = b.closest('.rb');
    if (!rb) return;
    setBlock(rb, b.getAttribute('data-set') === 'en' ? 'en' : 'zh');
  });
})();
