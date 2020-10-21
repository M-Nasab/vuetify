// Mixins
import Directionable from '../../mixins/directionable'

// Types
import { VNode } from 'vue'

/* @vue/component */
export default Directionable.extend({
  name: 'v-direction-provider',

  props: { root: Boolean },

  computed: {
    componentIsRTL (): boolean {
      return this.root
        ? this.rootIsRTL
        : Directionable.options.computed.componentIsRTL.call(this)
    },
  },

  render (): VNode {
    /* istanbul ignore next */
    return (
      this.$slots.default! &&
      this.$slots.default!.find(node => !node.isComment && node.text !== ' ')!
    )
  },
})
