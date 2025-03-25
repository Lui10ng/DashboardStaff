export function scrollTo(elementId: string, offset: number = 80): Promise<void> {
    return new Promise((resolve) => {
      const element = document.getElementById(elementId);
      if (!element) {
        resolve();
        return;
      }
      const headerOffset = 80; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
  
      // Resolve after animation (typical duration is 500ms)
      setTimeout(resolve, 500);
    });
  }