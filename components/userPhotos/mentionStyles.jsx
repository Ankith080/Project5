let css = {
    backgroundColor: "#E0F2F8",
    '&multiLine': {
        control: {
            fontFamily: 'monospace',
            minHeight: 63,
        },
        highlighter: {
            padding: 9,
            border: '1px solid transparent',
        },
        input: {
            padding: 9,
            border: '1px solid silver',
        },
    },
    '&singleLine': {
        display: 'inline-block',
        width: 180,
        highlighter: {
            padding: 1,
            border: '2px inset transparent',
        },
        input: {
            padding: 1,
            border: '2px inset',
        },
    },
}

export default css;