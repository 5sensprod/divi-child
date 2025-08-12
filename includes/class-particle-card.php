<?php
if (!defined('ABSPATH')) {
    exit;
}

class AXE_Particle_Card
{
    public function __construct()
    {
        add_shortcode('particle_card', array($this, 'particle_card_shortcode'));
    }

    public function particle_card_shortcode($atts)
    {
        $atts = shortcode_atts(array(
            'id'     => 'particle-card-' . wp_generate_uuid4(),
            'width'  => 340,
            'height' => 340,
        ), $atts, 'particle_card');

        ob_start();
?>
        <aside class="particle-card-wrap">
            <div id="<?php echo esc_attr($atts['id']); ?>"
                class="particle-card"
                style="
                 width: <?php echo (int)$atts['width']; ?>px; 
                 height: <?php echo (int)$atts['height']; ?>px; 
                 border-radius: 50%;
                 backdrop-filter: blur(12px);
                 -webkit-backdrop-filter: blur(12px);
                 box-shadow: 0 6px 16px rgba(0,0,0,.15);
                 background-color: rgba(255,255,255,.08);
                 margin: auto;
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                 justify-content: center;
                 text-align: center;
                 position: relative;
                 overflow: hidden;
               ">
                <!-- Canvas simple -->
                <canvas class="bg-blobs" aria-hidden="true"
                    style="position:absolute; inset:0; z-index:1; pointer-events:none;"></canvas>

                <!-- Contenu principal -->
                <div style="position: relative; z-index: 2;">
                    <!-- Adresse -->
                    <div style="margin-bottom: 8px;">
                        <div style="display:flex; align-items:center; justify-content:center; gap:5px; margin-bottom:5px;">
                            <span class="et-pb-icon" style="font-size:20px; color:#d4b57a;">&#xe081;</span>
                        </div>
                        <p style="margin:0; line-height:1.3; font-size:13px; color:#d6c9b1;">
                            4 Rue Lochet<br>51000 Châlons-en-Champagne
                        </p>
                    </div>
                    <!-- Horaires -->
                    <div>
                        <div style="display:flex; align-items:center; justify-content:center; gap:5px; margin-bottom:4px;">
                            <span class="et-pb-icon" style="font-size:20px; color:#b8924c;">&#xe06b;</span>
                        </div>
                        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:3px; color:#d6c9b1;">
                            <li>
                                <p style="padding:0 0 1px 0; font-weight:600; font-size:13px;">Lundi</p>
                                <p style="margin:0; font-size:12px;">15:00–19:00</p>
                            </li>
                            <li>
                                <p style="padding:0; font-weight:600; font-size:13px;">Mardi–Vendredi</p>
                                <p style="margin:0 10px; font-size:12px;">10:00–12:00 • 14:00–19:00</p>
                            </li>
                            <li>
                                <p style="padding:0; font-weight:600; font-size:13px;">Samedi</p>
                                <p style="margin:0; font-size:12px;">14:00–19:00</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
<?php
        return ob_get_clean();
    }
}
