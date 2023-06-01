const panels = document.querySelectorAll('.panel');

panels.forEach(panel => panel.addEventListener('transitionend', toggleActive));