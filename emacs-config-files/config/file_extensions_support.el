(require 'gradle-mode)

(setq auto-mode-alist
      (append
       `(("\\.h\\'" . c++mode))
       auto-mode-alist))

(autoload 'markdown-mode "markdown-mode"
   "Major mode for editing Markdown files" t)
(add-to-list 'auto-mode-alist '("\\.markdown\\'" . markdown-mode))
(add-to-list 'auto-mode-alist '("\\.md\\'" . markdown-mode))
