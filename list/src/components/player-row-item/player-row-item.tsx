import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'player-row-item',
  styleUrl: 'player-row-item.css',
  shadow: true,
})
export class PlayerRowItem {
  @Prop() name: string = '';
  @Prop() team: string = '';
  @Prop() league: string = '';
  @Prop() position: string = '';
  @Prop() imageUrl: string = '';
  @Prop() type: string = 'players';
  @Prop() isAdmin: boolean = false;
  @Prop() isLoggedIn: boolean = false;

  @Event() editClick: EventEmitter<void>;
  @Event() deleteClick: EventEmitter<void>;
  @Event() importClick: EventEmitter<void>;

  private getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  render() {
    return (
      <Host>
        <div class="avatar">
          {this.imageUrl 
            ? <img src={this.imageUrl} alt={this.name} />
            : <div class="initials">{this.getInitials(this.name)}</div>
          }
        </div>

        <div class="player-info">
          <h2>{this.name}</h2>
          <p>{this.team} <span class="dot">•</span> {this.league}</p>
        </div>

        {this.position && (
          <div class={`badge ${this.position.toLowerCase()}`}>
            {this.position}
          </div>
        )}

        <div class="actions">
          {this.isAdmin && (
            <div class="admin-buttons">
              <button class="btn" onClick={(e) => { e.stopPropagation(); this.editClick.emit(); }}>✏️</button>
              <button class="btn" onClick={(e) => { e.stopPropagation(); this.deleteClick.emit(); }}>🗑️</button>
            </div>
          )}

          {(this.type === 'external' && this.isLoggedIn) && (
            <button class="btn" onClick={(e) => { e.stopPropagation(); this.importClick.emit(); }}>📥</button>
          )}
        </div>
      </Host>
    );
  }
}