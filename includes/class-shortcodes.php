<?php
if (!defined('ABSPATH')) {
    exit;
}

class AXE_Shortcodes
{

    public function __construct()
    {
        add_shortcode('hero', array($this, 'hero_shortcode'));
    }

    public function hero_shortcode($atts)
    {
        $atts = shortcode_atts(array(
            'title' => 'Titre par défaut',
            'subtitle' => '',
            'background' => '',
            'height' => '500px',
            'text_color' => '#ffffff',
            'overlay' => '0.5'
        ), $atts);

        $background_style = '';
        if (!empty($atts['background'])) {
            $background_style = 'background-image: url(' . esc_url($atts['background']) . '); background-size: cover; background-position: center;';
        }

        $overlay_style = 'background: rgba(0,0,0,' . floatval($atts['overlay']) . ');';

        ob_start();
?>
        <div class="axemusique-hero" style="height: <?php echo esc_attr($atts['height']); ?>; position: relative; display: flex; align-items: center; justify-content: center; <?php echo $background_style; ?>">
            <div class="hero-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; <?php echo $overlay_style; ?>"></div>
            <div class="hero-content" style="position: relative; z-index: 2; text-align: center; color: <?php echo esc_attr($atts['text_color']); ?>;">
                <h1 class="hero-title" style="font-size: 3rem; margin-bottom: 1rem; font-weight: bold;">
                    <?php echo esc_html($atts['title']); ?>
                </h1>
                <?php if (!empty($atts['subtitle'])): ?>
                    <p class="hero-subtitle" style="font-size: 1.5rem; opacity: 0.9;">
                        <?php echo esc_html($atts['subtitle']); ?>
                    </p>
                <?php endif; ?>
            </div>
        </div>
<?php
        return ob_get_clean();
    }
}
