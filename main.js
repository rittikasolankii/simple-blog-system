// Get the current year for the footer copyright
document.addEventListener('DOMContentLoaded', function() {
    // Add any client-side JavaScript functionality here
    
    // Example: Add confirmation for delete buttons
    const deleteButtons = document.querySelectorAll('.btn-danger');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        if (!confirm('Are you sure you want to delete this post?')) {
          e.preventDefault();
        }
      });
    });
    
    // Example: Auto-resize textarea
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
    });
  });