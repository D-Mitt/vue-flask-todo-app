import { mount } from '@vue/test-utils'
import Home from '../../../src/components/Home.vue'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

describe('Home.vue', () => {

  let actions
  let store

  beforeEach(() => {
    actions = {
      actionClick: jest.fn(),
      actionInput: jest.fn()
    }
    store = new Vuex.Store({
      state: {},
      actions
    })
  })

  it('is a Vue instance', () => {
    const wrapper = mount(Home, {store })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
