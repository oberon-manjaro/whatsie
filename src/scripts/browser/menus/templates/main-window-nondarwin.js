import platform from 'common/utils/platform';
import $ from 'browser/menus/expressions';

export default {
  label: 'Window',
  allow: platform.isNonDarwin,
  submenu: [{
    label: '&Reload',
    accelerator: 'Ctrl+R',
    needsWindow: true,
    click: $.reloadWindow()
  }, {
    label: 'Re&set',
    accelerator: 'Ctrl+Alt+R',
    needsWindow: true,
    click: $.resetWindow()
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: '&Float on Top',
    accelerator: 'Ctrl+Shift+F',
    needsWindow: true,
    click: $.floatOnTop($.key('checked'))
  }, {
    type: 'checkbox',
    label: 'Show in &Tray',
    enabled: !global.options.distro.isElementaryOS,
    click: $.all(
      $.showInTray($.key('checked')),
      $.setPref('show-tray', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-tray')),
    )
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Close with &Escape Key',
    click: $.setPref('close-with-esc', $.key('checked')),
    parse: $.setLocal('checked', $.pref('close-with-esc'))
  }, {
    type: 'checkbox',
    label: 'Open Links in &Browser',
    click: $.setPref('links-in-browser', $.key('checked')),
    parse: $.setLocal('checked', $.pref('links-in-browser'))
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: '&Notifications Badge in ' + (platform.isLinux ? 'Dock' : 'Taskbar'),
    needsWindow: true,
    click: $.all(
      $.setPref('show-notifications-badge', $.key('checked')),
      $.updateSibling('exclude-muted-chats', 'enabled', $.key('checked')),
      $.updateUnreadMessagesCount(),
      platform.isLinux ? $.hideDockBadge($.key('checked')) : $.hideTaskbarBadge($.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-notifications-badge'))
    )
  }, {
    id: 'exclude-muted-chats',
    type: 'checkbox',
    label: 'Exclude &Muted Chats',
    needsWindow: true,
    click: $.all(
      $.setPref('exclude-muted-chats', $.key('checked')),
      $.updateUnreadMessagesCount()
    ),
    parse: $.all(
      $.setLocal('enabled', $.pref('show-notifications-badge')),
      $.setLocal('checked', $.pref('exclude-muted-chats'))
    )
  }]
};
