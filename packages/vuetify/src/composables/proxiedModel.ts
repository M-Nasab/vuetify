import { ref, computed, getCurrentInstance } from 'vue'
import type { SetupContext, Ref } from 'vue'
import { kebabCase } from '../util/helpers'
import { consoleError } from '../util/console'

export function useProxiedModel<
  Inner,
  Props extends {},
  Prop extends Extract<keyof Props, string>,
> (
  props: Props,
  context: SetupContext<any>,
  prop: Prop,
  defaultValue?: Props[Prop],
  transformIn: (value?: Props[Prop]) => Inner = (v: any) => v,
  transformOut: (value: Inner) => Props[Prop] = (v: any) => v,
) {
  const vm = getCurrentInstance()
  const propIsDefined = computed(() => {
    if (!vm || !vm.vnode.props) {
      consoleError('useProxiedModel must be called from inside a setup function')
      return false
    }
    return typeof props[prop] !== 'undefined' && (vm.vnode.props.hasOwnProperty(prop) || vm.vnode.props.hasOwnProperty(kebabCase(prop)))
  })

  const internal = ref(transformIn(propIsDefined.value ? props[prop] : defaultValue)) as Ref<Inner>

  return computed<Inner>({
    get () {
      if (propIsDefined.value) return transformIn(props[prop])
      else return internal.value
    },
    set (newValue) {
      internal.value = newValue
      context.emit(`update:${prop}`, transformOut(newValue))
    },
  })
}
