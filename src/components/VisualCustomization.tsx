import React, { useState } from 'react'
import {
  Palette,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  RotateCw,
  Square,
  Circle,
  Triangle,
  Eye,
  Layers,
  LucideIcon,
} from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'

interface LayoutPreset {
  id: string
  name: string
  description: string
  timerPosition: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  sidebarPosition: 'left' | 'right' | 'hidden'
  notificationPosition: 'top' | 'bottom' | 'center'
  timerSize: 'small' | 'medium' | 'large' | 'xl'
  showBackground: boolean
  showProgress: boolean
  compactMode: boolean
}

interface AnimationSettings {
  transitions: boolean
  pulseEffect: boolean
  breathingAnimation: boolean
  particleEffects: boolean
  glowEffects: boolean
  animationSpeed: number
}

const VisualCustomization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layout' | 'animations' | 'effects' | 'responsive'>(
    'layout'
  )
  const [selectedPreset, setSelectedPreset] = useState<string>('default')
  const [customLayout, setCustomLayout] = useState<Partial<LayoutPreset>>({})
  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>({
    transitions: true,
    pulseEffect: true,
    breathingAnimation: false,
    particleEffects: false,
    glowEffects: true,
    animationSpeed: 1.0,
  })
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const { currentTheme } = useThemeStore()

  const layoutPresets: LayoutPreset[] = [
    {
      id: 'default',
      name: 'Classic Center',
      description: 'Traditional centered layout with sidebar',
      timerPosition: 'center',
      sidebarPosition: 'left',
      notificationPosition: 'top',
      timerSize: 'large',
      showBackground: true,
      showProgress: true,
      compactMode: false,
    },
    {
      id: 'minimal',
      name: 'Minimal Focus',
      description: 'Clean, distraction-free design',
      timerPosition: 'center',
      sidebarPosition: 'hidden',
      notificationPosition: 'center',
      timerSize: 'xl',
      showBackground: false,
      showProgress: false,
      compactMode: true,
    },
    {
      id: 'corner',
      name: 'Corner Display',
      description: 'Timer in corner for multitasking',
      timerPosition: 'top-right',
      sidebarPosition: 'right',
      notificationPosition: 'bottom',
      timerSize: 'small',
      showBackground: true,
      showProgress: true,
      compactMode: true,
    },
    {
      id: 'immersive',
      name: 'Immersive Full',
      description: 'Full-screen immersive experience',
      timerPosition: 'center',
      sidebarPosition: 'left',
      notificationPosition: 'center',
      timerSize: 'xl',
      showBackground: true,
      showProgress: true,
      compactMode: false,
    },
  ]

  const timerShapes = [
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'square', name: 'Square', icon: Square },
    { id: 'rounded', name: 'Rounded', icon: Square },
    { id: 'hexagon', name: 'Hexagon', icon: Triangle },
  ]

  const getPresetById = (id: string) => layoutPresets.find(p => p.id === id)

  const updateLayoutSetting = (key: keyof LayoutPreset, value: string | boolean) => {
    setCustomLayout(prev => ({ ...prev, [key]: value }))
  }

  const updateAnimationSetting = (key: keyof AnimationSettings, value: boolean | number) => {
    setAnimationSettings(prev => ({ ...prev, [key]: value }))
  }

  const applyPreset = (presetId: string) => {
    const preset = getPresetById(presetId)
    if (preset) {
      setSelectedPreset(presetId)
      setCustomLayout(preset)
    }
  }

  const resetToDefaults = () => {
    applyPreset('default')
    setAnimationSettings({
      transitions: true,
      pulseEffect: true,
      breathingAnimation: false,
      particleEffects: false,
      glowEffects: true,
      animationSpeed: 1.0,
    })
  }

  const exportCustomization = () => {
    const config = {
      layout: customLayout,
      animations: animationSettings,
      theme: currentTheme,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ketchew-visual-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importCustomization = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const config = JSON.parse(e.target?.result as string)
          if (config.layout) setCustomLayout(config.layout)
          if (config.animations) setAnimationSettings(config.animations)
        } catch {
          console.error('Invalid configuration file')
        }
      }
      reader.readAsText(file)
    }
  }

  const TabButton: React.FC<{ id: string; label: string; icon: LucideIcon }> = ({
    id,
    label,
    icon: Icon,
  }) => (
    <button
      onClick={() => setActiveTab(id as 'layout' | 'animations' | 'effects' | 'responsive')}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Palette size={24} className="text-purple-600" />
          <h2 className="text-2xl font-bold">Visual Customization</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetToDefaults}
            className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
          >
            Reset
          </button>
          <button
            onClick={exportCustomization}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Export
          </button>
          <label className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 cursor-pointer">
            Import
            <input type="file" accept=".json" onChange={importCustomization} className="hidden" />
          </label>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <TabButton id="layout" label="Layout" icon={Layout} />
        <TabButton id="animations" label="Animations" icon={RotateCw} />
        <TabButton id="effects" label="Effects" icon={Layers} />
        <TabButton id="responsive" label="Responsive" icon={Monitor} />
      </div>

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          {/* Preset Selection */}
          <div>
            <h3 className="font-semibold mb-3">Layout Presets</h3>
            <div className="grid grid-cols-2 gap-3">
              {layoutPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedPreset === preset.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm text-gray-600">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Timer Position */}
          <div>
            <h3 className="font-semibold mb-3">Timer Position</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'top-left', label: 'Top Left' },
                { value: 'center', label: 'Center' },
                { value: 'top-right', label: 'Top Right' },
                { value: 'bottom-left', label: 'Bottom Left' },
                { value: '', label: '' },
                { value: 'bottom-right', label: 'Bottom Right' },
              ].map((pos, index) =>
                pos.value ? (
                  <button
                    key={pos.value}
                    onClick={() => updateLayoutSetting('timerPosition', pos.value)}
                    className={`p-3 border rounded text-sm ${
                      customLayout.timerPosition === pos.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {pos.label}
                  </button>
                ) : (
                  <div key={index} />
                )
              )}
            </div>
          </div>

          {/* Timer Size */}
          <div>
            <h3 className="font-semibold mb-3">Timer Size</h3>
            <div className="flex gap-2">
              {['small', 'medium', 'large', 'xl'].map(size => (
                <button
                  key={size}
                  onClick={() => updateLayoutSetting('timerSize', size)}
                  className={`px-4 py-2 border rounded capitalize ${
                    customLayout.timerSize === size
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Shape */}
          <div>
            <h3 className="font-semibold mb-3">Timer Shape</h3>
            <div className="flex gap-2">
              {timerShapes.map(shape => (
                <button
                  key={shape.id}
                  className="flex items-center gap-2 px-4 py-2 border rounded hover:border-gray-300"
                >
                  <shape.icon size={16} />
                  {shape.name}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div>
            <h3 className="font-semibold mb-3">Display Options</h3>
            <div className="space-y-3">
              {[
                { key: 'showBackground', label: 'Show Background Image' },
                { key: 'showProgress', label: 'Show Progress Ring' },
                { key: 'compactMode', label: 'Compact Mode' },
              ].map(option => (
                <label key={option.key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={customLayout[option.key as keyof LayoutPreset] as boolean}
                    onChange={e =>
                      updateLayoutSetting(option.key as keyof LayoutPreset, e.target.checked)
                    }
                    className="rounded"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Animations Tab */}
      {activeTab === 'animations' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Animation Settings</h3>
            <div className="space-y-4">
              {[
                {
                  key: 'transitions',
                  label: 'Smooth Transitions',
                  description: 'Enable smooth state transitions',
                },
                {
                  key: 'pulseEffect',
                  label: 'Pulse Effect',
                  description: 'Timer pulses with heartbeat rhythm',
                },
                {
                  key: 'breathingAnimation',
                  label: 'Breathing Animation',
                  description: 'Gentle breathing-like animation',
                },
                {
                  key: 'particleEffects',
                  label: 'Particle Effects',
                  description: 'Floating particles around timer',
                },
                {
                  key: 'glowEffects',
                  label: 'Glow Effects',
                  description: 'Soft glow around active elements',
                },
              ].map(setting => (
                <div key={setting.key} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={animationSettings[setting.key as keyof AnimationSettings] as boolean}
                    onChange={e =>
                      updateAnimationSetting(
                        setting.key as keyof AnimationSettings,
                        e.target.checked
                      )
                    }
                    className="mt-1 rounded"
                  />
                  <div>
                    <div className="font-medium">{setting.label}</div>
                    <div className="text-sm text-gray-600">{setting.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Animation Speed</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm">Slow</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={animationSettings.animationSpeed}
                onChange={e => updateAnimationSetting('animationSpeed', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm">Fast</span>
              <span className="text-sm text-gray-600 w-8">{animationSettings.animationSpeed}x</span>
            </div>
          </div>
        </div>
      )}

      {/* Effects Tab */}
      {activeTab === 'effects' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Visual Effects</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Blur Effects</h4>
                <input type="range" min="0" max="10" defaultValue="0" className="w-full" />
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Brightness</h4>
                <input type="range" min="50" max="150" defaultValue="100" className="w-full" />
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Contrast</h4>
                <input type="range" min="50" max="150" defaultValue="100" className="w-full" />
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Saturation</h4>
                <input type="range" min="0" max="200" defaultValue="100" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Tab */}
      {activeTab === 'responsive' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Device Preview</h3>
            <div className="flex gap-2 mb-4">
              {[
                { id: 'desktop', label: 'Desktop', icon: Monitor },
                { id: 'tablet', label: 'Tablet', icon: Tablet },
                { id: 'mobile', label: 'Mobile', icon: Smartphone },
              ].map(device => (
                <button
                  key={device.id}
                  onClick={() => setPreviewMode(device.id as 'desktop' | 'tablet' | 'mobile')}
                  className={`flex items-center gap-2 px-3 py-2 rounded ${
                    previewMode === device.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <device.icon size={16} />
                  {device.label}
                </button>
              ))}
            </div>

            {/* Preview Frame */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div
                className={`mx-auto bg-white rounded border ${
                  previewMode === 'mobile'
                    ? 'w-64 h-96'
                    : previewMode === 'tablet'
                      ? 'w-96 h-72'
                      : 'w-full h-64'
                }`}
              >
                <div className="p-4 h-full flex items-center justify-center text-gray-500">
                  {previewMode} Preview
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Responsive Breakpoints</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Mobile (&lt; 768px)</span>
                <button className="text-blue-500">Customize</button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Tablet (768px - 1024px)</span>
                <button className="text-blue-500">Customize</button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Desktop (&gt; 1024px)</span>
                <button className="text-blue-500">Customize</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={18} />
          <span className="font-medium">Live Preview</span>
        </div>
        <div className="text-sm text-gray-600">
          Changes will be applied in real-time to your timer interface. Use the preview modes above
          to test different screen sizes.
        </div>
      </div>
    </div>
  )
}

export default VisualCustomization
