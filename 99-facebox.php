<?php
/*
Plugin Name: Facebox download
Plugin URI: http://www.iesay.com/99-facebox-download/
Description: Facebox download is a lightbox alternative using jQuery and styled like a facebook modal box. Facebox gallery is derived from <a href="http://wordpress.org/extend/plugins/wp-facebox/" target="_blank">Daniel Stockman's Facebox v1.2.2</a> .使用方法: <code>[idl id="自定义值" t="要显示的链接文字"] 下载链接列表 [/idl]</code>. 或是图片弹窗<code>[idl img="file.jpg"]图片地址[/idl]</code>. .
Version: 1.0.0
Author: 99839
Author URI: 99839
*/

class WP_Facebox {
	var $opts;
	var $site;
	var $home;
	var $root; // plugin root dir
    var $ver = 2;

	/*
		Utilities
	*/
	function header() {
        if ( $this->ver == 1 ) {
            echo <<<HTML
<link rel="stylesheet" type="text/css" href="{$this->root}/facebox.css" />
<script type="text/javascript">/* wp-facebox */
	WPFB = { root: "{$this->root}", home: "{$this->home}", site: "{$this->site}" };
	WPFB.options = { loadingImage: WPFB.root + '/images/loading.gif', closeImage: WPFB.root + '/images/closelabel.gif', opacity: 0.5 };
</script>\n
HTML;
        } elseif ( $this->ver == 2 ) {
            echo <<<HTML
<link rel="stylesheet" type="text/css" href="{$this->root}/facebox2.css" />
<script type="text/javascript">/* wp-facebox */
	WPFB = { root: "{$this->root}", home: "{$this->home}", site: "{$this->site}" };
	WPFB.options = { 
        loading_image   : WPFB.root + '/images/loading.gif',
        close_image     : WPFB.root + '/images/closelabel.gif',
        image_types     : [ 'png', 'jpg', 'jpeg', 'gif' ],
        next_image      : WPFB.root + '/images/fast_forward.png',
        prev_image      : WPFB.root + '/images/rewind.png',
        play_image      : WPFB.root + '/images/play.png',
        pause_image     : WPFB.root + '/images/pause.png'
    };
</script>\n
HTML;
        }
	}

	function invoke_header() {
		$selectors = array();
		if ( $this->opts['do_default'] ) $selectors[] = "a[rel*='facebox']";
		if ( $this->opts['do_gallery'] ) $selectors[] = ".gallery-item a";
		$selectors = implode(', ', $selectors);
		if ( !empty($selectors) )
			echo "<script type=\"text/javascript\">if (jQuery && jQuery.facebox) jQuery(function($) { $(\"$selectors\").facebox(WPFB.options); });</script>\n";
	}

	function rel_replace( $content ) {
		$pattern = "/<a(.*?)href=('|\")(.*?).(bmp|gif|jpeg|jpg|png)('|\")(.*?)>(.*?)<\/a>/i";
		$replacement = '<a$1href=$2$3.$4$5 rel="facebox"$6>$7</a>';
		$content = preg_replace($pattern, $replacement, $content);
		return $content;
	}

	function filter_gallery_link( $link, $id ) {
		// By default, the gallery shortcode creates permalinks to the attachment
		// Facebox, however, expects a direct link to the resource
		// wp_get_attachment_url does this for us
		// I <3 filters
		return wp_get_attachment_url( $id );
	}

	/*
		Init / Constructor
	*/
	function init() {
		$this->home = get_option('home');
		$this->site = get_option('siteurl');
		$this->root = $this->site . '/wp-content/plugins/wp-facebox-download';

        if ( $this->ver == 1) {
            wp_register_script( 'facebox', "{$this->root}/facebox.js", array('jquery'), '1.2' );
        } elseif ( $this->ver == 2) {
            wp_register_script( 'facebox', "{$this->root}/facebox2.js", array('jquery'), '2.0' );
        }

		if ( $this->opts['loadscript'] ) {
			wp_enqueue_script( 'facebox' );
			add_action( 'wp_print_scripts', array(&$this, 'header') );
			add_action( 'wp_head',   array(&$this, 'invoke_header') );
			// turn gallery permalinks into direct links
			add_filter( 'attachment_link', array(&$this, 'filter_gallery_link'), 11, 2 );
		}

		if ( $this->opts['autofilter'] ) {
			add_filter( 'the_content', array(&$this, 'rel_replace') );
		}
	}

	function WP_Facebox() {	// constructor
		// TODO: implement admin options interface for these values
		// For the time being, turn off options by replacing 1 with 0
		$this->opts = array(
			'autofilter' => 1,
			'do_default' => 1,
			'do_gallery' => 1,
			'loadscript' => 1
		);
		// don't disable 'loadscript', unless you're only after the header output
		$this->init();
	}
}

// make those julienne fries, baby
$wp_facebox = new WP_Facebox();


       function lightbox_99dl($atts, $content = null) {

	extract(shortcode_atts(array(

		'id' => '',

		'img' => '',

		't' => '',

	), $atts));

	if ($id) {

		return '<div id="download">

			<div id="down_link">
				<a rel="facebox" href="#'.$id.'">点击进入 ['.$t.'] 演示下载地址列表</a>
                                <p><a href="https://me.alipay.com/jeray" target="_blank">点我赞助作者</a>.如无特殊说明,本文件解压密码为:iesay.com.</p>

				<noscript>&amp;amp;amp;amp;lt;br/&amp;amp;amp;amp;gt;&amp;amp;amp;amp;lt;font color="red"&amp;amp;amp;amp;gt;提取下载地址失败，请尝试按CTRL+F5刷新，或者更换浏览器。&amp;amp;amp;amp;lt;/font&amp;amp;amp;amp;gt;</noscript>

			</div>

		</div>

		<div class="clear"></div>

		

		<div id="'.$id.'" style="display:none">

		


	<div class="part">

				<div class="part_content">

						<iframe id="ADSpFrame" border="0" vspace="0" hspace="0" marginWidth="0" marginHeight="0" frameSpacing="0" frameBorder="0" scrolling="no" width="468" height="60" src="'.WP_PLUGIN_URL.'/'.plugin_basename(dirname(__FILE__)).'/adlinks.php"></iframe>

				</div>

				<div style="clear:both"></div>

			</div>

	<div class="part">下载及演示地址：'.$content.'</div>

	<div class="part">

	<strong>温馨提示：</strong>

	<p>本站所有软件和资料均为软件作者提供或网友推荐发布而来，仅供学习和研究使用，不得用于任何商业用途。如本站不慎侵犯你的版权请联系我，我将及时处理、撤下相关内容！</p>

	</div>

	<div class="part1">
1.Iesay.com is looking for the best free wordpress theme here..</br>
2.We only index and link to content provided by other sites</br>
3.<a href="http://signup.clicksor.com/pub/index.php?ref=232889" target="_blank">Start making money with your website!!</a></br>
4.<A HREF="http://www.postlinks.com?aff=9408" TARGET="_blank">Sell text links on your WordPress blog</A>

</div>
	

';

	} elseif ($img) {

		return '<a rel="facebox" href="'.$img.'">'.$content.'</a>';

	}

}

add_shortcode('idl', 'lightbox_99dl');

?>