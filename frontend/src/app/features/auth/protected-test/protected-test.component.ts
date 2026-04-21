import { Component } from '@angular/core';

@Component({
  selector: 'app-protected-test',
  standalone: true,
  template: `<h2>Protected page works</h2><p>You are authorized.</p>`
})
export class ProtectedTestComponent {}