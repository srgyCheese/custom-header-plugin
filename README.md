stretchyHeader
-------
_vanilla js plugin for custom header_

To start working with StretchyHeader you must download and import plugin before your closing ```<body>``` tag:
```html
<script type="text/javascript" src="./stretchyHeader.min.js"></script>
```

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
delay | object | {} | Delay before header starts open.
delay.inPixels | integer | 0 | In px.
delay.inHeaderHeight | integer | 0 | Delay is header height * delay.inHeaderHeight
autoShift | object | {} | Mobile auto close/open header when user stop srcolling.
autoShift.type | string | null | Mode of auto shift. Now it's only 1 mode 'header'
autoShift.openedClass | string | "" | Class when header open
autoShift.closedClass | string | "" | Class when header close
