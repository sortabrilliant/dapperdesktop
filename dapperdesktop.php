<?php
/**
 * Plugin Name: Dapper Desktop
 * Plugin URI:  https://sortabrilliant.com/dapperdesktop/
 * Description: A boring desktop is the sign of a boring life. Let's fix that.
 * Author:      sorta brilliant
 * Author URI:  https://sortabrilliant.com/
 * Version:     1.0.1
 * License:     GPL-2.0-or-later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package DapperDesktop
 */

namespace SortaBrilliant\DapperDesktop;

const PLUGIN_DIR  = __DIR__;
const PLUGIN_FILE = __FILE__;

require_once PLUGIN_DIR . '/inc/image-editor.php';
require_once PLUGIN_DIR . '/inc/rest-api.php';
require_once PLUGIN_DIR . '/inc/block.php';
