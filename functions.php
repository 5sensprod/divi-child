<?php

/**
 * Functions.php - Divi Child AXE MUSIQUE
 * 
 * @package AXE_MUSIQUE
 * @version 2.0.0
 */

// Sécurité
if (!defined('ABSPATH')) {
    exit;
}

// ========================================
// 🔧 CONSTANTES
// ========================================

define('AXE_THEME_VERSION', '2.0.0');
define('AXE_THEME_DIR', get_stylesheet_directory());
define('AXE_THEME_URL', get_stylesheet_directory_uri());

// ========================================
// 📁 CHARGEMENT DES MODULES
// ========================================

require_once AXE_THEME_DIR . '/includes/class-assets-manager.php';
require_once AXE_THEME_DIR . '/includes/class-shortcodes.php';
require_once AXE_THEME_DIR . '/includes/class-particle-card.php';

// ========================================
// 🚀 INITIALISATION
// ========================================

function axemusique_init()
{
    new AXE_Assets_Manager();
    new AXE_Shortcodes();
    new AXE_Particle_Card();
}
add_action('after_setup_theme', 'axemusique_init');

// ========================================
// 🎨 SUPPORT THÈME
// ========================================

add_theme_support('post-thumbnails');
add_theme_support('menus');

// ========================================
// 🏷️ BODY CLASSES
// ========================================

function axemusique_body_classes($classes)
{
    $classes[] = 'axemusique-theme';
    return $classes;
}
add_filter('body_class', 'axemusique_body_classes');

// ========================================
// ⚡ OPTIMISATIONS
// ========================================

function axemusique_cleanup()
{
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('init', 'axemusique_cleanup');

function charger_polices_personnalisees()
{
    wp_enqueue_style(
        'polices-personnalisees',
        get_stylesheet_directory_uri() . '/style.css',
        array(),
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'charger_polices_personnalisees');
add_action('et_fb_enqueue_assets', 'charger_polices_personnalisees');

function enable_menu_rest_api()
{
    register_rest_route('wp/v2', '/menus', array(
        'methods' => 'GET',
        'callback' => 'get_menus_data',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'enable_menu_rest_api');

function get_menus_data()
{
    $menus = wp_get_nav_menus();
    $menu_data = array();

    foreach ($menus as $menu) {
        $menu_items = wp_get_nav_menu_items($menu->term_id);
        $menu_data[$menu->slug] = array(
            'name' => $menu->name,
            'items' => array()
        );

        foreach ($menu_items as $item) {
            $menu_data[$menu->slug]['items'][] = array(
                'id' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'parent' => $item->menu_item_parent
            );
        }
    }

    return $menu_data;
}

// 2. Ajouter des champs personnalisés à l'API
function add_custom_fields_to_api()
{
    // Pour les produits WooCommerce
    register_rest_field('product', 'custom_data', array(
        'get_callback' => function ($object) {
            $product = wc_get_product($object['id']);
            return array(
                'stock_status' => $product->get_stock_status(),
                'gallery_images' => array_map(function ($id) {
                    return wp_get_attachment_url($id);
                }, $product->get_gallery_image_ids()),
                'variations' => $product->is_type('variable') ? $product->get_available_variations() : null
            );
        }
    ));
}
add_action('rest_api_init', 'add_custom_fields_to_api');

// 3. Configurer CORS pour votre domaine React
function add_cors_headers()
{
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Remplacez par votre domaine React
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
add_action('rest_api_init', 'add_cors_headers');

// 4. Endpoint personnalisé pour les données globales du site
function site_global_data()
{
    register_rest_route('wp/v2', '/site-data', array(
        'methods' => 'GET',
        'callback' => 'get_site_global_data',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'site_global_data');

function get_site_global_data()
{
    return array(
        'site_title' => get_bloginfo('name'),
        'site_description' => get_bloginfo('description'),
        'logo' => get_theme_mod('custom_logo') ? wp_get_attachment_url(get_theme_mod('custom_logo')) : null,
        'contact_info' => array(
            'email' => get_option('admin_email'),
            'phone' => get_option('phone_number', '') // Option personnalisée
        )
    );
}
