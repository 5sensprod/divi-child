<?php
if (!defined('ABSPATH')) {
    exit;
}

class AXE_Logo_Manager
{

    public function __construct()
    {
        add_action('wp_footer', array($this, 'custom_logo_script'));
    }

    public function custom_logo_script()
    {
?>
        <script>
            function replaceLogo() {
                const logoImg = document.getElementById('logo');
                if (logoImg && !document.querySelector('.text-logo-container')) {
                    logoImg.style.display = 'none';

                    const newLogo = document.createElement('div');
                    newLogo.id = 'logo';
                    newLogo.className = 'text-logo-container';
                    newLogo.style.position = 'relative';

                    // Créer les blobs SVG (statiques)
                    const svg = createLogoBlobsSVG();

                    // Créer le div glow
                    const glow = createLogoGlow();

                    // Créer le logo texte
                    const textLogo = createTextLogo();

                    // Assembler : blobs + glow + logo texte
                    newLogo.appendChild(svg);
                    newLogo.appendChild(glow);
                    newLogo.appendChild(textLogo);

                    logoImg.parentNode.insertBefore(newLogo, logoImg.nextSibling);

                    // Ajouter l'effet glow interactif
                    addGlowEffect(newLogo, glow);
                }
            }

            function createLogoBlobsSVG() {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('class', 'logo-blobs');
                svg.setAttribute('width', '240');
                svg.setAttribute('height', '86');
                svg.setAttribute('viewBox', '0 0 220 80');
                svg.setAttribute('fill', 'none');

                const circles = [{
                        cx: 40,
                        cy: 32,
                        r: 26,
                        fill: 'var(--blob-a)'
                    },
                    {
                        cx: 100,
                        cy: 22,
                        r: 20,
                        fill: 'var(--blob-b)'
                    },
                    {
                        cx: 150,
                        cy: 34,
                        r: 24,
                        fill: 'var(--blob-c)'
                    },
                    {
                        cx: 190,
                        cy: 26,
                        r: 18,
                        fill: 'var(--blob-d)'
                    }
                ];

                circles.forEach(circleData => {
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', circleData.cx);
                    circle.setAttribute('cy', circleData.cy);
                    circle.setAttribute('r', circleData.r);
                    circle.setAttribute('fill', circleData.fill);
                    svg.appendChild(circle);
                });

                return svg;
            }

            function createLogoGlow() {
                const glow = document.createElement('div');
                glow.id = 'logoGlow';
                glow.style.position = 'absolute';
                glow.style.pointerEvents = 'none';
                glow.style.left = '50%';
                glow.style.top = '50%';
                glow.style.width = '100px';
                glow.style.height = '100px';
                glow.style.transform = 'translate(-50%, -50%)';
                glow.style.borderRadius = '50%';
                glow.style.opacity = '0';
                glow.style.mixBlendMode = 'screen';
                glow.style.filter = 'blur(12px)';
                glow.style.transition = 'opacity 0.25s ease';
                glow.style.background = 'radial-gradient(circle, rgba(255,210,130,.22) 0%, rgba(255,120,120,.16) 35%, rgba(140,120,255,.12) 55%, rgba(255,255,255,0) 72%)';
                glow.style.zIndex = '-1';
                return glow;
            }

            function createTextLogo() {
                const textLogo = document.createElement('a');
                textLogo.className = 'text-logo';
                textLogo.href = '/';

                const axeSpan = document.createElement('span');
                axeSpan.className = 'brand-axe';
                axeSpan.textContent = 'AXE';

                const musiqueSpan = document.createElement('span');
                musiqueSpan.className = 'brand-musique';
                musiqueSpan.textContent = 'MUSIQUE';

                textLogo.appendChild(axeSpan);
                textLogo.appendChild(musiqueSpan);

                return textLogo;
            }

            function addGlowEffect(wrap, glow) {
                let rafId = null;

                function moveGlow(e) {
                    const rect = wrap.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const base = Math.max(140, Math.min(260, rect.width * 1.05));
                    glow.style.width = base + 'px';
                    glow.style.height = base + 'px';
                    glow.style.left = x + 'px';
                    glow.style.top = y + 'px';
                    glow.style.opacity = '0.45';
                }

                wrap.addEventListener('mousemove', (e) => {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(() => moveGlow(e));
                });

                wrap.addEventListener('mouseenter', () => {
                    glow.style.opacity = '0.22';
                });

                wrap.addEventListener('mouseleave', () => {
                    glow.style.opacity = '0';
                });
            }

            // Initialisation
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', replaceLogo);
            } else {
                replaceLogo();
            }

            setTimeout(replaceLogo, 100);
        </script>
<?php
    }
}
