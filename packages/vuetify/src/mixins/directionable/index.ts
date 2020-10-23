import Vue from 'vue'
import { PropType, RenderContext } from 'vue/types/options'

interface options extends Vue {
    isRTL: boolean
}

/* @vue/component */
const Directionable = Vue.extend<options>().extend({
  name: 'directionable',

  provide (): object {
    return {
      isRTL: this.directionableProvide,
    }
  },

  inject: {
    isRTL: {
      default: false,
    },
  },

  props: {
    rtl: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    ltr: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
  },

  data () {
    return {
      directionableProvide: false,
    }
  },

  computed: {
    appIsRTL (): boolean {
      return this.$vuetify.rtl || false
    },
    componentIsRTL (): boolean {
      if (this.rtl === true) {
        // explicitly rtl
        return true
      } else if (this.ltr === true) {
        // explicitly ltr
        return false
      } else {
        // inherit from parent, or default false if there is none
        return this.isRTL
      }
    },
    directionClasses (): Dictionary<boolean> {
      return {
        'direction--rtl': this.componentIsRTL,
        'direction--ltr': !this.componentIsRTL,
      }
    },
    /** Used by menus and dialogs, inherits from v-app instead of the parent */
    rootIsRTL (): boolean {
      if (this.rtl === true) {
        // explicitly rtl
        return true
      } else if (this.ltr === true) {
        // explicitly ltr
        return false
      } else {
        // inherit from v-app
        return this.appIsRTL
      }
    },
    rootDirectionClasses (): Dictionary<boolean> {
      return {
        'direction--rtl': this.rootIsRTL,
        'direction--ltr': !this.rootIsRTL,
      }
    },
  },

  watch: {
    componentIsRTL: {
      handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.directionableProvide = this.isRTL
        }
      },
      immediate: true,
    },
  },
})

export default Directionable

export function functionalDirectionClasses (context: RenderContext): object {
  const vm = {
    ...context.props,
    ...context.injections,
  }
  const componentIsRTL = Directionable.options.computed.componentIsRTL.call(vm)
  return Directionable.options.computed.directionClasses.call({ componentIsRTL })
}
