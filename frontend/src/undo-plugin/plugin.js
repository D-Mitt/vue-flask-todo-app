export default {
  install (Vue) {
    Vue.mixin({
      data () {
        return {
          undoStates: []
        }
      },
      created () {
        this.$store.subscribe(mutation => {
          console.log(mutation.type)
          if (mutation.type === 'SAVE_STATE') {
            this.undoStates.push(JSON.stringify(this.$store.state))
          }
        })
      },
      methods: {
        undo () {
          if (this.canUndo) {
            this.$store.replaceState(JSON.parse(this.undoStates.pop()))
          }
        }
      },
      computed: {
        canUndo () {
          return this.undoStates.length > 0
        }
      }
    })
  }
}
