<?php
if (!defined('ABSPATH')) {
    exit;
}

class AXE_SVG_Slider
{
    public function __construct()
    {
        add_action('wp_head', array($this, 'add_svg_debug_styles'));
    }

    /**
     * Ajoute des styles de debug pour identifier les sections avec SVG
     */
    public function add_svg_debug_styles()
    {
        if (WP_DEBUG) {
            echo '<style>
                /* Debug: met en évidence les sections avec SVG background */
                .et_pb_section[style*=".svg"] {
                    position: relative;
                }
                .et_pb_section[style*=".svg"]::before {
                    content: "SVG Section";
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(255, 61, 209, 0.8);
                    color: white;
                    padding: 2px 6px;
                    font-size: 10px;
                    z-index: 1000;
                    pointer-events: none;
                }
            </style>';
        }
    }

    /**
     * Shortcode pour afficher le slider SVG
     */
    public static function svg_slider_shortcode($atts, $content = null)
    {
        $atts = shortcode_atts(array(
            'autoplay' => '5000',
            'svg_target' => '',
        ), $atts);

        ob_start();
?>
        <div class="axe-slider" data-autoplay="<?php echo esc_attr($atts['autoplay']); ?>" <?php echo $atts['svg_target'] ? ' data-svg-target="' . esc_attr($atts['svg_target']) . '"' : ''; ?>>
            <!-- Overlay pour transition d'opacité -->
            <div class="transition-overlay"></div>

            <?php echo do_shortcode($content); ?>
        </div>
<?php
        return ob_get_clean();
    }
}

// Enregistre le shortcode
add_shortcode('axe_svg_slider', array('AXE_SVG_Slider', 'svg_slider_shortcode'));
