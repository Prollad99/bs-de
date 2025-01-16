module Jekyll
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'tag'
        site.tags.each do |tag, posts|
          # Replace spaces with hyphens in the tag for URL purposes
          sanitized_tag = tag.gsub(' ', '-')
          # Ensure the URL ends with a trailing slash
          sanitized_tag_with_slash = "#{sanitized_tag}/"
          # Generate the tag page
          site.pages << TagPage.new(site, site.source, File.join('tag', sanitized_tag_with_slash), tag)
        end
      end
    end
  end

  class TagPage < Page
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      # Set the raw tag for internal logic
      self.data['tag'] = tag
      # Set the title with capitalization
      self.data['title'] = tag.split.map(&:capitalize).join(' ')
    end
  end
end