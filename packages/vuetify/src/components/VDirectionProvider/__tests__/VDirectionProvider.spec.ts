// Components
import VDirectionProvider from '../VDirectionProvider'

// Utilities
import {
  mount,
  MountOptions,
  Wrapper,
} from '@vue/test-utils'

describe('VDirectionProvider.ts', () => {
  type Instance = InstanceType<typeof VDirectionProvider>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VDirectionProvider, {
        ...options,
      })
    }
  })

  it('should change based upon root $vuetify', () => {
    const wrapper = mountFunction({
      provide: {
        direction: {
          isRtl: true,
        },
      },
      mocks: {
        $vuetify: {
          rtl: false,
        },
      },
    })

    expect(wrapper.vm.isRtl).toBe(true)

    wrapper.setProps({ root: true })

    expect(wrapper.vm.isRtl).toBe(false)
  })
})
