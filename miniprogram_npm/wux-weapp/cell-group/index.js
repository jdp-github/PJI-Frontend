Component({
    externalClasses: ['wux-class'],
    relations: {
        '../cell/index': {
            type: 'child',
            linked() {
                this.updateIsLastElement('../cell/authorization')
            },
            linkChanged() {
                this.updateIsLastElement('../cell/authorization')
            },
            unlinked() {
                this.updateIsLastElement('../cell/authorization')
            },
        },
    },
    properties: {
        title: {
            type: String,
            value: '',
        },
        label: {
            type: String,
            value: '',
        },
    },
    methods: {
        updateIsLastElement() {
            const elements = this.getRelationNodes('../cell/authorization')
            if (elements.length > 0) {
                const lastIndex = elements.length - 1
                elements.forEach((element, index) => {
                    element.updateIsLastElement(index === lastIndex)
                })
            }
        },
    },
})