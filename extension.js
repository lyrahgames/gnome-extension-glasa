'use strict';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

// This class is used to separate the logic of the blinking animation
// from the main extension class and the rendering code.
// It provides a state that can be updated/advanced by the user
// and allows to access an animated value to control lid closing for eyes.
//
class GlasaBlinkAnimation {
  constructor() {
    this._value = 0.0;
    this._counter = 0;
    this._blink_period = 100;
    this._blink_duration = 10;
  }

  // This function returns the animated value
  // that will always lie in the interval [0,1].
  // The value will only change when 'update' is called.
  //
  value() { return this._value; }

  // This function advances the animation to the next time step
  // by incrementing the counter and recomputing the animation value.
  //
  update() {
    const MIN_BLINK_DURATION = 7;
    const MAX_BLINK_DURATION = 16;
    const MIN_BLINK_PERIOD = MAX_BLINK_DURATION;
    const MAX_BLINK_PERIOD = 200;
    //
    // Return pseudo-random integer number in the interval [min, max].
    //
    const RANDOM_UNIFORM = (min, max) => {
      let scale = max - min + 1;
      return min + Math.floor(Math.random() * scale);
    };
    //
    const RANDOM_BLINK_PERIOD = () => { //
      return RANDOM_UNIFORM(MIN_BLINK_PERIOD, MAX_BLINK_PERIOD);
    };
    //
    const RANDOM_BLINK_DURATION = () => {
      return RANDOM_UNIFORM(MIN_BLINK_DURATION, MAX_BLINK_DURATION);
    };

    // If the counter reaches the period, it will be reset.
    // Additionally, the period and the duration will be
    // newly chosen in a random way to "humanize" the blinking.
    //
    this._counter += 1;
    if (this._counter >= this._blink_period) {
      this._counter = 0;
      this._blink_period = RANDOM_BLINK_PERIOD();
      this._blink_duration = RANDOM_BLINK_DURATION();
    }

    this._compute_value();
  }

  // This functions computes the animation value
  // and should only be called by 'update'.
  //
  _compute_value() {
    // Provide constant in-place functions
    // to be used for constructing a bump function
    // that animates closing and opening of an eye lid.
    //
    // See: https://en.wikipedia.org/wiki/Bump_function
    //
    const F = (x) => { return (x <= 0.0) ? 0.0 : Math.exp(-1.0 / x); };
    const TRANSITION = (x) => { return F(x) / (F(x) + F(1 - x)); };
    const BUMP = (x) => { return TRANSITION(3 * x) * TRANSITION(3 * (1 - x)); };

    // If the blink is already over then return directly
    // without the actual calculation of the bump function.
    //
    if (this._counter >= this._blink_duration) {
      this._value = 0.0;
      return;
    }

    // Different blinks might be differently timed and fast.
    // Here, a bump function is used for all blinks
    // that is time-based scaled by their duration.
    //
    this._value = BUMP(this._counter / this._blink_duration);
  }
}

// Main Extension Class
//
export default class GlasaExtension extends Extension {
  constructor(metadata) {
    super(metadata);
    this._indicator = null;
    this._animation = new GlasaBlinkAnimation();
  }

  enable() {
    const ICON_SIZE = 16;
    const ICON_WIDTH = 3 * ICON_SIZE;
    const ICON_HEIGHT = ICON_SIZE;
    const FRAME_TIME = 50; // ms

    // Retrieve the extension's settings and make changing them
    // update the extension's indicator and pop-up menu.
    //
    this._settings = this.getSettings();
    this._settings_handler = null;
    this._settings_handler = this._settings.connect('changed', () => {
      this._position_changed();
      this._popupmenu_created();
    });

    // Set up the indicator's icon by providing width and height
    // and the repaint callback that will continuously render the eyes.
    //
    this._icon = new St.DrawingArea({width : ICON_WIDTH, height : ICON_HEIGHT});
    this._repaint_handler = null;
    this._repaint_handler =
        this._icon.connect('repaint', () => { this._render(); });

    // Continuously repaint the icon after a fixed frame time
    // by using a basic timer in the main loop.
    //
    this._update_handler = null;
    this._update_handler =
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, FRAME_TIME, () => {
          this._icon.queue_repaint();
          return GLib.SOURCE_CONTINUE;
        });

    // Set up the indicator itself and make it a button.
    //
    let indicator_name = `${this.metadata.name} Indicator`;
    this._indicator = new PanelMenu.Button(0.0, indicator_name, false);

    // Correctly style and align the indicator's icon
    // and finally add it to the indicator itself.
    //
    let hbox = new St.BoxLayout({style_class : 'system-status-icon'});
    hbox.add_child(this._icon);
    this._indicator.add_child(hbox);
    this._icon.queue_repaint();

    // Add the indicator to the status area.
    // Afterwards, the position will be correctly determined.
    // This could be done in a better way.
    //
    Main.panel.addToStatusArea(indicator_name, this._indicator);
    this._position_changed();
    this._popupmenu_created();
  }

  disable() {
    if (this._settings_handler) {
      this._settings.disconnect(this._settings_handler);
      this._settings_handler = null;
    }

    if (this._update_handler) {
      GLib.Source.remove(this._update_handler);
      this._update_handler = null;
    }

    if (this._repaint_handler) {
      this._icon.disconnect(this._repaint_handler);
      this._repaint_handler = null;
    }

    this._indicator.destroy();

    this._indicator = null;
    this._icon = null;
    this._settings = null;
  }

  _position_changed() {
    this._indicator.get_parent().remove_actor(this._indicator);
    let boxes = {
      0 : Main.panel._leftBox,
      1 : Main.panel._centerBox,
      2 : Main.panel._rightBox,
    };
    let p = this._settings.get_int('panel-box');
    let q = this._settings.get_int('panel-box-location');
    boxes[p].insert_child_at_index(this._indicator, q);
  }

  _popupmenu_created() {
    this._indicator.menu.removeAll();
    this._indicator.menu.addAction(this._settings.get_string('panel-message'),
                                   () => {});
    this._indicator.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this._indicator.menu.addAction(_("Preferences"),
                                   () => this.openPreferences());
  }

  // This function is the repaint callback
  // that is called by the repaint handler for the icon.
  // It will render everything into the icon's drawing area.
  //
  _render() {
    const LINE_WIDTH = 1.5;

    // Get and set up the Cairo context.
    //
    let cr = this._icon.get_context();
    let theme_node = this._icon.get_theme_node();
    Clutter.cairo_set_source_color(cr, theme_node.get_foreground_color());
    cr.setLineWidth(LINE_WIDTH);

    // Use shortcuts for width and height.
    //
    let width = this._icon.width;
    let height = this._icon.height;

    // Get relative mouse position for eyes to look at.
    //
    let [offset_x, offset_y] = this._icon.get_transformed_position();
    let [mouse_x, mouse_y, mask] = global.get_pointer();
    mouse_x -= offset_x;
    mouse_y -= offset_y;

    // After start-up the offset values might be 'NaN'.
    // This results in a critical error from Cairo.
    //
    if (isNaN(mouse_x) || isNaN(mouse_y))
      return;

    // Draw animated comic-style eyes.
    //
    let lid_closing = this._animation.value();
    this._animation.update();
    this._draw_comic_eyes(cr, width, height, mouse_x, mouse_y, lid_closing);
  }

  // This functions draws two comic-style eyes
  // with variable lid closing that look at a certain position.
  //
  // For other eye styles, another function like this could be introduced.
  //
  _draw_comic_eyes(
      cr,                   // Cairo Context
      width, height,        //
      look_at_x, look_at_y, // Look-At Position on Screen
      lid_closing // Parameter between 0 (for eye open) and 1 (for eye closed)
  ) {
    const EYE_DEPTH_SCALE = 3;
    const BROW_RADIUS_SCALE = 1.4;
    const IRIS_RADIUS_SCALE = 0.5;

    // The radius of the eyeballs need to be computed in such a way
    // that the brows can be placed above them.
    //
    let eye_radius = height / (1 + BROW_RADIUS_SCALE);

    // The eye radius is used as reference length.
    //
    let eye_depth = EYE_DEPTH_SCALE * eye_radius;
    let brow_radius = BROW_RADIUS_SCALE * eye_radius;
    let iris_radius = IRIS_RADIUS_SCALE * eye_radius;

    // Draw left eye.
    //
    let left_center = width / 2 - eye_radius + cr.getLineWidth() / 2;
    this._draw_eye(cr,                                 //
                   left_center, brow_radius,           //
                   eye_depth, eye_radius, iris_radius, //
                   look_at_x, look_at_y,               //
                   lid_closing);

    // Draw left brow.
    //
    cr.arc(left_center, brow_radius,              //
           brow_radius - cr.getLineWidth() / 2,   //
           5.0 * Math.PI / 4, 6.5 * Math.PI / 4); //
    cr.stroke();

    // Draw right eye.
    //
    let right_center = width / 2 + eye_radius - cr.getLineWidth() / 2;
    this._draw_eye(cr,                                 //
                   right_center, brow_radius,          //
                   eye_depth, eye_radius, iris_radius, //
                   look_at_x, look_at_y,               //
                   lid_closing);

    // Draw right brow.
    //
    cr.arc(right_center, brow_radius,           //
           brow_radius - cr.getLineWidth() / 2, //
           5.5 * Math.PI / 4, 7 * Math.PI / 4); //
    cr.stroke();
  }

  // This functions draws a single eyeball with iris/pupil
  // with variable lid closing that looks at a given position.
  // It can be used as a drawing primitive
  // for setting up styles with more than a single eye.
  //
  _draw_eye(
      cr,                      // Cairo Context
      center_x, center_y,      // Position of the Eye Center
      eye_depth,               // Virtual Depth Behind the Screen
      eye_radius, iris_radius, //
      look_at_x, look_at_y,    // Position on Screen for Eye to Look At
      lid_closing              // Ratio in [0,1] for Lid to be closed
  ) {
    cr.save();

    // Calculate look-at coordinates relative to center position.
    //
    cr.translate(center_x, center_y);
    look_at_x -= center_x;
    look_at_y -= center_y;

    // Compute distances from eye position to look-at position.
    //
    let projected_distance =
        Math.sqrt(look_at_x * look_at_x + look_at_y * look_at_y);
    let distance = Math.sqrt(projected_distance * projected_distance +
                             eye_depth * eye_depth);

    // Iris Movement
    //
    // The effect of squishing the iris
    // by using a scaling transformation in the mouse direction
    // is an approximation of the actual projection of the iris seen as circle
    // on the eyeball onto the virtual screen.
    // Hence, using an iris movement bound is done to make the approximation
    // valid and improve the overall visual style.
    //
    // To-Do:
    // The bound of iris movement could probably be calculated
    // by using the ratio between iris and eyeball radius.
    //
    const IRIS_MOVE_SCALE_BOUND = 0.45;
    let iris_move_scale = projected_distance / distance;
    if (iris_move_scale > IRIS_MOVE_SCALE_BOUND)
      iris_move_scale = IRIS_MOVE_SCALE_BOUND;
    let iris_move = eye_radius * iris_move_scale;

    // Iris Squish
    //
    // The calculation for the squishing of the iris can be done as follows.
    //
    //   let iris_scale = eye_depth / distance;
    //
    // But this expression is not aware of the movement bound.
    // Instead, the previously computed iris movement will be used.
    //
    let iris_scale = Math.sqrt(1 - iris_move_scale * iris_move_scale);

    // This computation is not founded in mathematics
    // It can be more visually appealing to allow for stronger squishing of the
    // iris.
    //
    // iris_scale = Math.pow(iris_scale, 2);

    // Draw eye outline.
    //
    cr.arc(0, 0,                               // Offset
           eye_radius - cr.getLineWidth() / 2, // Radius
           0, 2 * Math.PI);                    // Start/Stop Angle
    cr.stroke();

    // Draw iris/pupil.
    //
    cr.save();
    cr.rotate(Math.PI / 2 - Math.atan2(look_at_x, look_at_y));
    cr.translate(iris_move, 0);
    cr.scale(iris_scale, 1);
    cr.arc(0, 0,                                // Offset
           iris_radius - cr.getLineWidth() / 2, // Radius
           0, 2 * Math.PI);                     // Start/Stop Angle
    cr.fill();
    cr.restore();

    // Draw eye lid.
    //
    // The style could be improved by filling non-convex shapes.
    // However, non-convex shapes seem not be filled correctly.
    //
    let lid_angle = 0.5 * Math.PI - Math.acos(1 - 2 * lid_closing);
    cr.arc(0, 0, eye_radius, lid_angle - Math.PI, -lid_angle);
    cr.closePath();
    cr.fill();

    cr.restore();
  }
}
