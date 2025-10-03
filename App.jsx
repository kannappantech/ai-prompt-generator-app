import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Copy, Wand2, Edit, Save, Sparkles, Brain, Image, MessageSquare, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthModal } from './components/AuthModal'
import './App.css'

function App() {
  const [userInput, setUserInput] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [targetTool, setTargetTool] = useState('chatgpt')
  const [promptStyle, setPromptStyle] = useState('creative')
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('https://xlhyimcdvjzk.manus.space/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setIsAuthModalOpen(false)
  }

  const handleLogout = async () => {
    try {
      await fetch('https://xlhyimcdvjzk.manus.space/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleGenerate = async () => {
    if (!userInput.trim()) return
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('https://xlhyimcdvjzk.manus.space/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userInput,
          target_tool: targetTool,
          prompt_style: promptStyle,
          user_id: user?.id
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setGeneratedPrompt(data.prompt.generated_prompt)
      } else {
        console.error('Error generating prompt:', data.error)
        // Fallback to mock prompt
        const mockPrompt = generateMockPrompt(userInput, targetTool, promptStyle)
        setGeneratedPrompt(mockPrompt)
      }
    } catch (error) {
      console.error('Network error:', error)
      // Fallback to mock prompt
      const mockPrompt = generateMockPrompt(userInput, targetTool, promptStyle)
      setGeneratedPrompt(mockPrompt)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockPrompt = (input, tool, style) => {
    const prompts = {
      chatgpt: {
        creative: `Act as a creative writing assistant. ${input}. Please provide a detailed, imaginative response that explores multiple perspectives and includes vivid descriptions. Use storytelling techniques to make your response engaging and memorable.`,
        factual: `Provide a comprehensive, factual analysis of: ${input}. Include relevant data, statistics, and credible sources. Structure your response with clear headings and bullet points for easy reading.`,
        detailed: `Please provide an in-depth, step-by-step explanation of: ${input}. Break down complex concepts into understandable parts, include examples, and explain the reasoning behind each step.`
      },
      dalle: {
        creative: `/imagine ${input}, artistic style, vibrant colors, dynamic composition, high detail, professional photography lighting, 8K resolution --ar 16:9 --v 6`,
        factual: `/imagine ${input}, photorealistic, accurate representation, natural lighting, documentary style, high resolution --ar 16:9 --v 6`,
        detailed: `/imagine ${input}, highly detailed, intricate design, professional quality, studio lighting, ultra-high resolution, perfect composition --ar 16:9 --v 6 --style raw`
      },
      midjourney: {
        creative: `${input} --style expressive --chaos 50 --ar 16:9 --v 6.1 --stylize 750`,
        factual: `${input} --style raw --ar 16:9 --v 6.1 --stylize 250`,
        detailed: `${input} --style raw --quality 2 --ar 16:9 --v 6.1 --stylize 500 --chaos 25`
      }
    }
    
    return prompts[tool]?.[style] || `Generate content about: ${input}`
  }

  const handleCopy = async () => {
    if (generatedPrompt) {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getToolIcon = (tool) => {
    switch (tool) {
      case 'chatgpt': return <MessageSquare className="w-4 h-4" />
      case 'dalle': return <Image className="w-4 h-4" />
      case 'midjourney': return <Sparkles className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
              >
                <Wand2 className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Prompt Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Transform Your Ideas into Perfect AI Prompts
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Generate optimized prompts for ChatGPT, DALL-E, Midjourney, and more. 
              Turn your simple ideas into detailed, effective AI instructions.
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>What do you want to achieve with AI?</span>
                </CardTitle>
                <CardDescription>
                  Describe your goal in plain language, and we'll create the perfect prompt for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Example: I want to create an image of a cat playing guitar in a jazz club..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] resize-none border-2 focus:border-blue-500 transition-colors"
                />
                
                {/* Configuration Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target AI Tool</label>
                    <Select value={targetTool} onValueChange={setTargetTool}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chatgpt">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>ChatGPT</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dalle">
                          <div className="flex items-center space-x-2">
                            <Image className="w-4 h-4" />
                            <span>DALL-E</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="midjourney">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Midjourney</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prompt Style</label>
                    <Select value={promptStyle} onValueChange={setPromptStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="factual">Factual</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!userInput.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
                  size="lg"
                >
                  {isGenerating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Wand2 className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Wand2 className="w-5 h-5 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Prompt'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <AnimatePresence>
            {generatedPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        {getToolIcon(targetTool)}
                        <span>Generated Prompt</span>
                        <Badge variant="secondary" className="ml-2">
                          {targetTool.toUpperCase()}
                        </Badge>
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Your optimized prompt is ready to use. Copy it and paste into your AI tool.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Textarea
                        value={generatedPrompt}
                        readOnly
                        className="min-h-[120px] resize-none bg-gray-50 dark:bg-gray-900 border-2"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="text-center p-6 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold mb-2">Multiple AI Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Generate prompts optimized for ChatGPT, DALL-E, Midjourney, and more
              </p>
            </Card>
            
            <Card className="text-center p-6 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="font-semibold mb-2">Smart Optimization</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI-powered prompt enhancement for better results
              </p>
            </Card>
            
            <Card className="text-center p-6 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <Save className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Save & Organize</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Keep your best prompts organized and easily accessible
              </p>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2025 AI Prompt Generator. Built with React and love.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default App
