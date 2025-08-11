<?php
if (!defined('ABSPATH')) {
    exit;
}

// Constantes
define('AXE_THEME_VERSION', '2.0.0');
define('AXE_THEME_DIR', get_stylesheet_directory());
define('AXE_THEME_URL', get_stylesheet_directory_uri());

// Chargement des modules
require_once AXE_THEME_DIR . '/includes/class-assets-manager.php';
require_once AXE_THEME_DIR . '/includes/class-logo-manager.php';
require_once AXE_THEME_DIR . '/includes/class-shortcodes.php';

// Initialisation
function axemusique_init()
{
    new AXE_Assets_Manager();
    new AXE_Logo_Manager();
    new AXE_Shortcodes();
}
add_action('after_setup_theme', 'axemusique_init');

// Support thème (de votre functions.php original)
add_theme_support('post-thumbnails');
add_theme_support('menus');

// Body classes (de votre functions.php original)
function axemusique_body_classes($classes)
{
    $classes[] = 'axemusique-theme';
    return $classes;
}
add_filter('body_class', 'axemusique_body_classes');

// Optimisations (de votre functions.php original)
function axemusique_cleanup()
{
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('init', 'axemusique_cleanup');
