import Vue from 'vue'
import { PropType, RenderContext } from 'vue/types/options'

interface options extends Vue {
    direction: {
      isRtl: boolean
    }
}

/* @vue/component */
const Directionable = Vue.extend<options>().extend({
  name: 'directionable',

  provide (): object {
    return {
      direction: this.directionableProvide,
    }
  },

  inject: {
    direction: {
      default: {
        isRtl: false,
      },
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
      directionableProvide: {
        isRtl: false,
      },
    }
  },

  computed: {
    appIsRTL (): boolean {
      return this.$vuetify.rtl || false
    },
    isRtl (): boolean {
      if (this.rtl === true) {
        // explicitly rtl
        return true
      } else if (this.ltr === true) {
        // explicitly ltr
        return false
      } else {
        // inherit from parent, or default false if there is none
        return this.direction.isRtl
      }
    },
    directionClasses (): Dictionary<boolean> {
      return {
        'direction--rtl': this.isRtl,
        'direction--ltr': !this.isRtl,
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
    isRtl: {
      handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.directionableProvide.isRtl = this.isRtl
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
  const isRtl = Directionable.options.computed.isRtl.call(vm)
  return Directionable.options.computed.directionClasses.call({ isRtl })
}
