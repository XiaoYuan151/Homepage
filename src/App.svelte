<script lang="ts">
  import { onMount, tick } from 'svelte';
  import {
    COMMANDS,
    HIDDEN_COMMANDS,
    PROMPT,
    SOCIAL_LINKS,
    motdLines,
    selectLocale,
    tr,
    type LocaleIndex,
  } from './terminalData';

  type TextLine = {
    id: number;
    type: 'text';
    text: string;
    className?: string;
  };

  type MotdLine = {
    id: number;
    type: 'motd';
    rows: Array<string | null>;
  };

  type LinksLine = {
    id: number;
    type: 'links';
  };

  type StatusLine = {
    id: number;
    type: 'status';
  };

  type NeofetchLine = {
    id: number;
    type: 'neofetch';
    rows: Array<{ art: string; info: string }>;
  };

  type RepoLine = {
    id: number;
    type: 'repo';
  };

  type TerminalLine = TextLine | MotdLine | LinksLine | StatusLine | NeofetchLine | RepoLine;

  let bodyEl: HTMLDivElement;
  let hiddenInput: HTMLInputElement;
  let lineId = 0;
  let output: TerminalLine[] = [];
  let commandBuffer = '';
  let hiddenValue = '';
  let composing = false;
  let history: string[] = [];
  let historyIndex = -1;
  let animToken = 0;
  let booted = false;
  let acceptingInput = false;
  let locale: LocaleIndex = 0;

  const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const nextLineId = () => ++lineId;
  const text = (key: Parameters<typeof tr>[0]) => tr(key, locale);

  function scrollDown() {
    tick().then(() => {
      if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
    });
  }

  function scrollIfNearBottom() {
    tick().then(() => {
      if (!bodyEl) return;
      if (bodyEl.scrollHeight - bodyEl.scrollTop - bodyEl.clientHeight < 50) {
        bodyEl.scrollTop = bodyEl.scrollHeight;
      }
    });
  }

  function addLine(lineText = '', className?: string) {
    output = [...output, { id: nextLineId(), type: 'text', text: lineText, className }];
  }

  function addMotd(rows = motdLines(locale)) {
    output = [...output, { id: nextLineId(), type: 'motd', rows: [...rows] }];
  }

  function addLinks() {
    output = [...output, { id: nextLineId(), type: 'links' }];
  }

  function addStatus() {
    output = [...output, { id: nextLineId(), type: 'status' }];
  }

  function addRepo() {
    output = [...output, { id: nextLineId(), type: 'repo' }];
  }

  function addNeofetch() {
    const art = [
      '         .---.',
      '        /     \\',
      '        \\.@-@./',
      '        /`\\_/`\\',
      '       //  _  \\\\',
      '      | \\     )|_',
      '     /`\\_`>  <_/ \\',
      "     \\__/'---'\\__/",
    ];
    const info = [
      '',
      text('neofetch_user'),
      '────────────────',
      text('neofetch_os'),
      text('neofetch_up'),
      text('neofetch_shell'),
      text('neofetch_de'),
      text('neofetch_st'),
    ];

    output = [
      ...output,
      {
        id: nextLineId(),
        type: 'neofetch',
        rows: art.map((row, index) => ({
          art: row.padEnd(20),
          info: info[index] || '',
        })),
      },
    ];
  }

  function renderWelcome() {
    output = [];
    addLine(PROMPT + 'whoami', 'dim');
    addLine(text('whoami_name'), 'neon');
    addLine(PROMPT + 'cat /etc/motd', 'dim');
    addMotd();
    addLine('');
    addLine(text('boot_hint'), 'dim');
    addLine('');
  }

  function skipAnimation() {
    if (booted) return;
    animToken++;
    renderWelcome();
    finishBoot();
  }

  function updateTextLine(id: number, nextText: string) {
    output = output.map((line) => (line.id === id && line.type === 'text' ? { ...line, text: nextText } : line));
  }

  function updateMotdRows(id: number, rows: Array<string | null>) {
    output = output.map((line) => (line.id === id && line.type === 'motd' ? { ...line, rows: [...rows] } : line));
  }

  async function typeLine(lineText: string, className?: string, speed?: number) {
    const token = ++animToken;
    const id = nextLineId();
    output = [...output, { id, type: 'text', text: '', className }];

    let rendered = '';
    for (const char of lineText) {
      if (animToken !== token) {
        updateTextLine(id, lineText);
        return;
      }
      rendered += char;
      updateTextLine(id, rendered);
      scrollDown();
      await sleep(speed ?? 10 + Math.random() * 28);
    }
  }

  async function typeMotdRow(id: number, rows: Array<string | null>, index: number, lineText: string) {
    const token = ++animToken;
    rows[index] = '';
    updateMotdRows(id, rows);

    let rendered = '';
    for (const char of lineText) {
      if (animToken !== token) {
        rows[index] = lineText;
        updateMotdRows(id, rows);
        return;
      }
      rendered += char;
      rows[index] = rendered;
      updateMotdRows(id, rows);
      scrollDown();
      await sleep(4);
    }
  }

  async function typeMotdSeparator(id: number, rows: Array<string | null>, index: number) {
    rows[index] = null;
    updateMotdRows(id, rows);
    scrollDown();
    await sleep(50);
  }

  async function bootSequence() {
    await sleep(500);
    if (booted) return;

    await typeLine(PROMPT + 'whoami', 'dim', 18);
    if (booted) return;
    await sleep(180);

    await typeLine(text('whoami_name'), 'neon', 32);
    if (booted) return;
    await sleep(380);

    await typeLine(PROMPT + 'cat /etc/motd', 'dim', 18);
    if (booted) return;
    await sleep(140);

    const id = nextLineId();
    const rows = Array.from({ length: motdLines(locale).length }, () => '');
    output = [...output, { id, type: 'motd', rows }];

    for (const [index, row] of motdLines(locale).entries()) {
      if (booted) return;
      if (row === null) {
        await typeMotdSeparator(id, rows, index);
      } else {
        await typeMotdRow(id, rows, index, row);
      }
    }

    await sleep(280);
    if (booted) return;
    addLine('');
    addLine(text('boot_hint'), 'dim');
    addLine('');

    finishBoot();
  }

  function finishBoot() {
    booted = true;
    acceptingInput = true;
    scrollDown();
    hiddenInput?.focus();
  }

  function runHidden(type: string) {
    switch (type) {
      case 'sudo':
        addLine(text('sudo_msg'), 'err');
        break;
      case 'rm':
        addLine(text('rm_msg'), 'err');
        break;
      case 'exit':
        addLine(text('exit_msg'), 'warn');
        break;
      case 'neuro':
        addLine(text('neuro_title'), 'neon');
        addLine(text('neuro_stnc'));
        addLine(text('neuro_tl'));
        addLine('');
        addLine(text('neuro_osu'), 'pink');
        break;
      case 'darkweb':
        addLine(text('darkweb_msg'), 'err');
        break;
      case 'love':
        addLine(text('love_msg'), 'dim');
        break;
    }
  }

  function runCommand(command: string) {
    addLine(PROMPT + command, 'dim');
    const normalized = command.trim();
    if (!normalized) {
      scrollDown();
      return;
    }

    history = [...history, normalized];
    historyIndex = history.length;

    const hidden = HIDDEN_COMMANDS.get(normalized);
    if (hidden) {
      runHidden(hidden);
      scrollDown();
      return;
    }

    switch (normalized) {
      case 'help':
      case '?':
        addLine('');
        addLine(text('help_whoami'));
        addLine(text('help_projects'));
        addLine(text('help_links'));
        addLine(text('help_status'));
        addLine(text('help_neofetch'));
        addLine(text('help_motd'));
        addLine(text('help_repo'));
        addLine(text('help_date'));
        addLine(text('help_clear'));
        addLine(text('help_help'));
        addLine('');
        addLine(text('help_footer'), 'dim');
        break;

      case 'whoami':
        addLine(text('whoami_name'), 'neon');
        addLine(text('whoami_info'));
        addLine(text('whoami_loc'));
        break;

      case 'projects':
        addLine(text('proj_title'), 'neon');
        addLine(text('proj_tl'), 'dim');
        addLine('');
        addLine(text('proj_studio'));
        addLine(text('proj_ai'));
        addLine(text('proj_bgp'));
        addLine(text('proj_neuro'));
        addLine(text('proj_proxy'));
        addLine(text('proj_shizuku'));
        addLine(text('proj_hw'));
        break;

      case 'links':
        addLinks();
        break;

      case 'motd':
        addMotd();
        break;

      case 'status':
        addStatus();
        addLine(text('status_doing'));
        addLine(text('status_cpu'));
        break;

      case 'neofetch':
        addNeofetch();
        break;

      case 'date':
        addLine(new Date().toString());
        break;

      case 'clear':
        output = [];
        break;

      case 'repo':
      case 'source':
        addLine(text('repo_title'));
        addRepo();
        break;

      default:
        addLine(text('cmd_notfound') + normalized, 'err');
        addLine(text('cmd_tryhelp'), 'dim');
    }

    scrollDown();
  }

  function drawInput(value = hiddenValue) {
    commandBuffer = value;
    scrollIfNearBottom();
  }

  function handleInput() {
    if (!acceptingInput || composing) return;
    drawInput(hiddenValue);
  }

  function handleCompositionEnd() {
    composing = false;
    drawInput(hiddenValue);
  }

  function setInputValue(value: string) {
    hiddenValue = value;
    commandBuffer = value;
    scrollIfNearBottom();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!acceptingInput) {
      event.preventDefault();
      skipAnimation();
      return;
    }

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        runCommand(commandBuffer);
        setInputValue('');
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!history.length) return;
        if (historyIndex === history.length) historyIndex = history.length - 1;
        else if (historyIndex > 0) historyIndex--;
        setInputValue(history[historyIndex]);
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (historyIndex >= history.length - 1) {
          historyIndex = history.length;
          setInputValue('');
        } else {
          historyIndex++;
          setInputValue(history[historyIndex]);
        }
        break;

      case 'Tab': {
        event.preventDefault();
        const match = COMMANDS.find((cmd) => cmd.startsWith(commandBuffer.trim().toLowerCase()));
        if (match) setInputValue(match);
        break;
      }

      case 'l':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          output = [];
          scrollDown();
        }
        break;

      case 'Backspace':
        requestAnimationFrame(() => drawInput(hiddenValue));
        break;
    }
  }

  function handleBodyClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target?.closest('a')) return;
    if (acceptingInput) hiddenInput?.focus();
    else skipAnimation();
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (acceptingInput) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length === 1 || event.key === 'Enter' || event.key === ' ') {
      skipAnimation();
    }
  }

  onMount(() => {
    locale = selectLocale();
    document.documentElement.lang = locale === 1 ? 'zh-CN' : 'en';
    bodyEl.addEventListener('click', handleBodyClick);
    window.addEventListener('keydown', handleWindowKeydown);
    bootSequence();

    console.log(
      '%c▓▒░ XiaoYuan151 ░▒▓ %c— %c17 %c— %cGuilin %c· AS209601',
      'color:#00ffc8;font-size:15px;text-shadow:0 0 10px rgba(0,255,200,0.5);',
      'color:#3e5068;',
      'color:#b8c4d4;',
      'color:#3e5068;',
      'color:#b8c4d4;',
      'color:#00aaff;',
    );
    console.log(
      '%cgithub.com/XiaoYuan151/Homepage %c— %czero-router BGP',
      'color:#3e5068;',
      'color:#3e5068;',
      'color:#ffb830;',
    );
    console.log('%cpoking around the console, huh', 'color:#1a2238;font-style:italic;');

    return () => {
      bodyEl.removeEventListener('click', handleBodyClick);
      window.removeEventListener('keydown', handleWindowKeydown);
    };
  });
</script>

<div class="window crt-flicker" id="crt-window">
  <div class="titlebar">
    <span class="dot r"></span>
    <span class="dot y"></span>
    <span class="dot g"></span>
    <span class="title glitch">XIAOYUAN151</span>
    <span class="hex-addr">0xAS209601</span>
  </div>

  <div class="body" id="terminal-body" bind:this={bodyEl}>
    <div id="output">
      {#each output as line (line.id)}
        {#if line.type === 'text'}
          <div class={'line' + (line.className ? ` ${line.className}` : '')}>{line.text}</div>
        {:else if line.type === 'motd'}
          <div class="line">
            <div class="motd-box">
              {#each line.rows as row}
                {#if row === null}
                  <hr class="motd-sep" />
                {:else}
                  <div class="motd-row">{row}</div>
                {/if}
              {/each}
            </div>
          </div>
        {:else if line.type === 'links'}
          {#each SOCIAL_LINKS as [label, href, display]}
            <div class="line link-line">
              <span>{label}</span>
              <a {href} target="_blank" rel="noopener">{display}</a>
            </div>
          {/each}
        {:else if line.type === 'status'}
          <div class="line neon">
            <span class="status-dot"></span>{locale === 1 ? ' 在线' : ' online'}
          </div>
        {:else if line.type === 'neofetch'}
          {#each line.rows as row}
            <div class="line">
              <span class="neofetch-line">{row.art}</span><span class="neofetch-info">{row.info}</span>
            </div>
          {/each}
        {:else if line.type === 'repo'}
          <div class="line">
            <a href="https://github.com/XiaoYuan151/Homepage" target="_blank" rel="noopener">
              github.com/XiaoYuan151/Homepage
            </a>
          </div>
        {/if}
      {/each}
    </div>

    <div id="input-line">
      <span id="prompt">{booted ? PROMPT : ''}</span><span id="input-text">{commandBuffer}</span
      ><span id="cursor" class:visible={booted}></span>
    </div>
  </div>
</div>

<input
  id="hidden-input"
  bind:this={hiddenInput}
  bind:value={hiddenValue}
  autocomplete="off"
  autocorrect="off"
  autocapitalize="off"
  spellcheck="false"
  oninput={handleInput}
  oncompositionstart={() => (composing = true)}
  oncompositionend={handleCompositionEnd}
  onkeydown={handleKeydown}
/>
