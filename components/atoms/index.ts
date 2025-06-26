import { atom } from 'jotai'


const SELECTED_ACTIVITY_BAR_TAB = atom<'prompts' | 'database' | 'tools'>('prompts')

export {
    SELECTED_ACTIVITY_BAR_TAB
}