=== WP Facebox download ===
Contributors: Facebox popup download
Donate link: https://me.alipay.com/jeray
Tags: facebox, lightbox, popup, download
Requires at least: 2.8
Tested up to: 3.3.1
Stable tag: 1.0.0

短码[idl]实现下载链接弹窗效果，使用facebox特效.适合资源下载日志及博客.

== Description ==

Facebox is a jQuery-based, Facebook-style lightbox which can display images, divs, or entire remote pages. It's simple to use and easy on the eyes. This plugin makes Facebox installation a breeze. Inspired by <a href="http://wordpress.org/extend/plugins/wp-facebox/">Daniel Stockman's Facebox v1.2.2</a>, 使用方法: <code>[idl id="自定义值" t="要显示的链接文字"] 下载链接列表 [/idl]</code>. 或是图片弹窗<code>[idl img="file.jpg"]图片地址[/idl]</code>. .

Related Links: <a href="http://www.iesay.com/99-facebox-download/" title="facebox popup">Plugin Homepage</a>, <a href="http://defunkt.io/facebox/" title="Facebox Official Website">Facebox</a>

*This release has been tested compatible with all WordPress versions since 3.0*

Please submit feedback to the plugin's home page in regards to features you would like to see in the future.

\* **Note**: *This version is surpot GG and other advised code.if have advised code, modify the "adlink.php".*


== Installation ==

1. Unzip and upload the `wp-facebox-download` directory to `/wp-content/plugins/`
2. Activate the plugin through the `Plugins` menu in WordPress
3. There is no step 3.\*

\* **Note**: *This version is surpot GG and other advised code.if have advised code, modify the "adlink.php".*

== Frequently Asked Questions ==

= What does this plugin do, exactly? =

a. The plugin is for popup download link.

b. the images is also used.

= Does this plugin work with all WordPress versions? =

This plugin has been tested to work with 3.0 and newer. If you are using an older version, it is highly recommended to upgrade for your sites own security.

= The plugin installed correctly but nothing happens =
a. I have found the plugin wp-minify destroys the jQuery reference which is essential for this plugin to work correctly.

b. You may have another plugin installed that is trying to do something very similiar. I suggest disabling all other plugins, and check to see if it begins working. If it does, re-enable each plugin one by one and checking inbetween. Once you have found the culprit, please post a comment at my blog letting me know and I will add it to a list of plugin that can cause it to break until I find a solution for it.

c. You may not be linking correctly to an image file or content. Linking to content requires you manually add the attribute to re="facebox" while linking to images does this automatically.

== Changelog ==

= 1.0 =
* Added adlink.php

== Screenshots ==

1. Image with Title & Caption
2. Closeup of gallery controls, Title & Caption
3. Closeup showing use of Flash being loaded via inline content
4. Example of embedded object like video being loaded via inline content.

== License ==

Good news, this plugin is free for everyone! Since it's released under the GPL, you can use it free of charge on your personal or commercial blog. But if you enjoy this plugin, you can thank me and leave a [small donation](https://me.alipay.com/jeray "Donate with 支付宝") for the time I've spent writing and supporting this plugin.

== Special Thanks ==