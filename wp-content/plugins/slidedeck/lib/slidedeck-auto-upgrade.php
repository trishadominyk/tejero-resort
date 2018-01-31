<?php 
/**
 * Based on the work of Anton Andriyevskyy. https://github.com/meglio/wp-upgrademe
 */

 if( !class_exists( 'SlideDeckAutoUpgrade' ) ) {
    class SlideDeckAutoUpgrade{
        /**
         * Stores parsed and validated data returned by unofficial APIs.
         * @var array
         */
        private static $data;

        private static $WP_FILTER_PREFIX = 'wpFilter_';

        public static function register() {
            add_action( 'in_plugin_update_message-' . plugin_basename( dirname( dirname( __FILE__ ) ) ) . '/slidedeck.php', array( 'SlideDeckAutoUpgrade', 'in_plugin_update_message_slidedeck' ), 10, 2 );
            
            $r = new ReflectionClass( __CLASS__ );
            $methods = $r->getMethods( ReflectionMethod::IS_PUBLIC );
            foreach( $methods as $m ) {
                /** @var ReflectionMethod $m */
                if ( $m->isStatic() && strpos( $m->getName(), self::$WP_FILTER_PREFIX ) === 0 )
                    add_filter( substr($m->getName(), strlen( self::$WP_FILTER_PREFIX ) ), array( get_class(), $m->getName() ), 10, $m->getNumberOfParameters() );
            }
        }

        public static function wpFilter_http_response( $response, $args, $url ) {
            # Control recursion
            static $recursion = false;
            if ( $recursion )
                return $response;

            if ( empty( $response ) || !is_array($response) || !isset($response['body']) )
                return $response;

            # Guess if it's time to take action
            # 
            # Here we are looking at the format of the API string. Even though API 1.1 is still beta,
            # we're seeing it in WordPress 3.7
            
            $api_version = '';
            if( strpos( $url,'api.wordpress.org/plugins/update-check/1.0') !== false ){
                $show_time = true;
                $api_version = '1.0';
            } elseif ( strpos( $url,'api.wordpress.org/plugins/update-check/1.1') !== false ) {
                $show_time = true;
                $api_version = '1.1';
            } else {
                $show_time = false;
            }
            
            # If this is not a plugin check response, just return it.
            if ( !$show_time )
                return $response;

            # Loop over plugins who provided <pluginName>_auto_upgrade() function and use returned url to request for up-to-date version signature.
            # Collect retrieved (only valid) data into $upgrademe
            $plugins = get_plugins();
            $upgrademe = array();
            foreach( $plugins as $file => $info ) {
                # Get url if function exists
                $slug_name = str_replace( '-', '_', basename( $file, '.php' ) );
                
                # Request latest version signature from custom url (non-WP plugins repository api) && validate response variables
                $recursion = true;
                $vars = self::load_plugin_data( $slug_name );
                $recursion = false;
                if ( empty($vars) )
                    continue;

                $upgrademe[$file] = $vars;
            }

            # If there's nothing to upgrade, then 
            # just return the response.
            if ( !count( $upgrademe ) )
                return $response;

            # If the API version is the older 1.0, then use the old method.
            if( $api_version == '1.0' ) {
                $body = $response['body'];
                if( !empty( $body ) )
                    $body = unserialize($body);
                
                if( empty( $body ) )
                    $body = array();
                
                foreach( $upgrademe as $file => $upgradeVars ) {
                    # Do not override data returned by official WP plugins repository API
                    if ( isset( $body[$file] ) )
                        continue;

                    # If new version is different then current one, only then add info
                    if( !isset( $plugins[$file]['Version'] ) || $plugins[$file]['Version'] == $upgradeVars['new_version'] )
                        continue;

                    $upgradeInfo = new stdClass();
                    $upgradeInfo->id = $upgradeVars['id'];
                    $upgradeInfo->slug = $upgradeVars['slug'];
                    $upgradeInfo->new_version = $upgradeVars['new_version'];
                    $upgradeInfo->url = $upgradeVars['url'];
                    $upgradeInfo->package = $upgradeVars['package'];
                    $body[$file] = $upgradeInfo;
                }
                $response['body'] = serialize( $body );
            } // End API 1.0 response

            # If the API version is the newer 1.1, then use the newer response format.
            if( $api_version == '1.1' ) {
                $body = $response['body'];
                $decoded_body = json_decode( $response['body'], true );
                $decoded_body['plugins'] = (array) $decoded_body['plugins'];

                foreach( $upgrademe as $file => $upgradeVars ) {
                    # Do not override data returned by official WP plugins repository API
                    if ( isset( $decoded_body['plugins'][$file] ) )
                        continue;

                    # If new version is different then current one, only then add info
                    if( !isset( $plugins[$file]['Version'] ) || $plugins[$file]['Version'] >= $upgradeVars['new_version'] )
                        continue;

                    $decoded_body['plugins'][$file] = array(
                        'id' => $upgradeVars['id'],
                        'slug' => $upgradeVars['slug'],
                        'new_version' => $upgradeVars['new_version'],
                        'url' => $upgradeVars['url'],
                        'package' => $upgradeVars['package']
                    );

                }
                $response['body'] = json_encode( $decoded_body );
            } // End API 1.1 response
            return $response;
        }

        public static function wpFilter_plugins_api( $value, $action, $args ) {
            // If for some reason value available already, do not change it
            if( !empty( $value ) )
                return $value;

            if( $action != 'plugin_information' || !is_object( $args ) || !isset( $args->slug ) || empty( $args->slug ) )
                return $value;

            $vars = self::load_plugin_data( $args->slug );
            if( empty( $vars ) )
                return $value;

            return (object) $vars['info'];
        }

        public static function wpFilter_http_request_args( $args, $url ) {
            if( strpos( $url, 'wp-upgrademe' ) === false || !is_array( $args ) )
                return $args;

            $args['sslverify'] = false;
            return $args;
        }

        private static function load_plugin_data( $slug ) {
            if( isset( self::$data[$slug] ) )
                return self::$data[$slug];

            $func_name = $slug.'_auto_upgrade';
            if( !function_exists( $func_name ) )
                return self::$data[$slug] = null;

            $upgrade_url = filter_var( call_user_func( $func_name ), FILTER_VALIDATE_URL );
            if( empty( $upgrade_url ) ) {
                return self::$data[$slug] = null;
            }

            # Request latest version signature from custom url (non-WP plugins repository api) && validate response variables
            $r = wp_remote_post( $upgrade_url, array(
                    'method' => 'POST', 
                    'timeout' => 15, 
                    'redirection' => 5, 
                    'httpversion' => '1.0', 
                    'blocking' => true,
                    'headers' => array(
                        'SlideDeck-Version' => SLIDEDECK_VERSION,
                        'User-Agent' => 'WordPress/' . get_bloginfo("version"),
                        'Referer' => get_bloginfo("url")
                    ),
                    'body' => null, 
                    'cookies' => array(),
                    'sslverify' => false
                )
            );

            if( is_wp_error( $r ) || !isset( $r['body'] ) || empty( $r['body'] ) ) {
                return self::$data[$slug] = null;
            }

            $vars = json_decode($r['body'], true);

            // Capture the extra vairables
            if( isset( $r['headers']['x-sd2-license-tier'] ) ) {
                update_option( 'slidedeck2_cached_tier', $r['headers']['x-sd2-license-tier'] );
            }
            if( isset( $r['headers']['x-sd2-license-expires'] ) ) {
                update_option( 'slidedeck2_cached_expiration', $r['headers']['x-sd2-license-expires'] );
            }
            
            if( empty($vars) || !is_array($vars) || count($vars) > 4 || !isset($vars['new_version']) || !isset($vars['url']) || !isset($vars['package']) || !isset($vars['info'])) {
                return self::$data[$slug] = null;
            }

            # 2 147 483 648 - max int32
            # 16 777 215 - ffffff = max possible value of 6-letters hex
            # 50 000 000 - reasonable offset
            # Finally generate ID between 50 000 000 and 66 777 215
            $vars['id'] = 50000000 + hexdec( substr( md5( $slug ), 1, 6 ) );

            $vars['slug'] = $slug;

            # Sanitize variables of "info"
            if ( !is_array( $vars['info'] ) ) {
                $vars['info'] = array();
            }

            $info = array();
            $fields = array(
                'name',
                'slug',
                'version',
                'author',
                'author_profile',
                'contributors',
                'requires',
                'tested',
                'compatibility',
                'rating',
                'num_ratings',
                'downloaded',
                'last_updated',
                'added',
                'homepage',
                'sections',
                'download_link',
                'tags'
            );
            foreach( $vars['info'] as $key => $val ) {
                if( !in_array( $key, $fields ) ) {
                    continue;
                }
                $info[$key] = $val;
            }
            $info['slug'] = $slug;
            $info['version'] = $vars['new_version'];
            $info['download_link'] = $vars['url'];
            $vars['info'] = $info;

            return self::$data[$slug] = $vars;
        }
        
        /**
         * Plugin Update Message - SlideDeck
         * 
         * Displays a helpful message if an update is available
         * but the user does not have a valid license key entered (no package is returned).
         */
        public static function in_plugin_update_message_slidedeck( $plugin_data, $response ){
            // If we're in SlideDeck and the package response is empty
            if( $response->slug == 'slidedeck2' && $response->package == '' ){
                global $SlideDeckPlugin;
                echo ' <em class="auto-update-license">';
                printf(__('Enter %1$syour license key%2$s  for updates.', $SlideDeckPlugin->namespace ), "<a href=\"" . 'admin.php?page=' . SLIDEDECK_BASENAME . '/options' . "\">", '</a>');
                echo '</em>';
            }
        }
    }// End of SlideDeckAutoUpgrade Class
    SlideDeckAutoUpgrade::register();
    
    /**
     * Auto Upgrade function for SlideDeck2
     */
    function slidedeck_auto_upgrade() {
        global $SlideDeckPlugin;
        $key = '';
        
        if( $SlideDeckPlugin ){
            $key = (string) $SlideDeckPlugin->get_license_key();
            $license = $SlideDeckPlugin->is_license_key_valid( $key );
            if( $license->tier < 10 ) return false;
        }
        return SLIDEDECK_UPDATE_SITE . '/wordpress-update/' . md5( $key ) . '/tier_5';
    }
    
    /**
     * Auto Upgrade function for SlideDeck2 Professional
     */
    function slidedeck_tier20_auto_upgrade() {
        global $SlideDeckPlugin;
        $key = '';
        
        if( $SlideDeckPlugin ){
            $key = (string) $SlideDeckPlugin->get_license_key();
            $license = $SlideDeckPlugin->is_license_key_valid( $key );
            if( $license->tier < 20 ) return false;
        }
        return SLIDEDECK_UPDATE_SITE . '/wordpress-update/' . md5( $key ) . '/tier_20';
    }
    
    /**
     * Auto Upgrade function for SlideDeck2 Developer
     */
    function slidedeck_tier30_auto_upgrade() {
        global $SlideDeckPlugin;
        $key = '';
        
        if( $SlideDeckPlugin ){
            $key = (string) $SlideDeckPlugin->get_license_key();
            $license = $SlideDeckPlugin->is_license_key_valid( $key );
            if( $license->tier < 30 ) return false;
        }
        return SLIDEDECK_UPDATE_SITE . '/wordpress-update/' . md5( $key ) . '/tier_30';
    }
    
}// End of if class_exists()
?>
