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
          // Dont user go back before first save as todo_list information will
          // be removed and a page refresh will need to occur.
          return this.undoStates.length > 1
        }
      }
    })
  }
}
