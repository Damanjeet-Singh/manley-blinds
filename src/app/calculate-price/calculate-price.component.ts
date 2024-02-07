import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

type relativeWidthPriceMap = {
  [key: number]: { [key: number]: number };
};

@Component({
  selector: 'app-calculate-price',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CurrencyPipe,
  ],
  templateUrl: './calculate-price.component.html',
  styleUrl: './calculate-price.component.scss',
})
export class CalculatePriceComponent {
  widthPriceRelativeToDrop: relativeWidthPriceMap = {
    600: {
      600: 944,
      700: 1036,
      800: 1119,
    },
    700: {
      600: 963,
      700: 1079,
      800: 1165,
    },
    800: {
      600: 987,
      700: 1106,
      800: 1197,
    },
  };

  dropPriceRelativeToWidth: relativeWidthPriceMap = {
    600: {
      600: 944,
      700: 963,
      800: 987,
    },
    700: {
      600: 1036,
      700: 1079,
      800: 1106,
    },
    800: {
      600: 1119,
      700: 1165,
      800: 1197,
    },
  };

  calculatedPrice!: number;
  minWidth = +Object.keys(this.dropPriceRelativeToWidth)[0];
  maxWidth = +Object.keys(this.dropPriceRelativeToWidth)[Object.keys(this.dropPriceRelativeToWidth).length - 1];

  minDrop = +Object.keys(this.widthPriceRelativeToDrop)[0];
  maxDrop = +Object.keys(this.widthPriceRelativeToDrop)[Object.keys(this.widthPriceRelativeToDrop).length - 1];

  priceCalculatorForm = new FormGroup({
    width: new FormControl(600, Validators.required),
    drop: new FormControl(600, Validators.required),
  });

  onSubmit() {
    console.log('minWidth', this.minWidth);
    console.log('maxWidth', this.maxWidth);

    console.log('minDrop', this.minDrop);
    console.log('maxDrop', this.maxDrop);

    const { width, drop } = this.priceCalculatorForm.value;
    if(width && drop) {
      if (width > drop) {
        let finalWidth: number = width;
        let finalDrop: number = drop;
        if (drop in this.widthPriceRelativeToDrop) {
          finalDrop = +drop;
        } else {
          const dropWidths = Object.keys(this.widthPriceRelativeToDrop);
          for (let dropWidth of dropWidths) {
            if (drop < +dropWidth) {
              finalDrop = +dropWidth;
              break;
            }
          }
        }

        if(width in this.widthPriceRelativeToDrop[finalDrop]) {
          finalWidth = +width;
        } else {
          const widths = Object.keys(this.widthPriceRelativeToDrop[finalDrop]);
          for(let relativeWidth of widths) {
            if(width < +relativeWidth) {
              finalWidth = +relativeWidth;
              break;
            }
          }
        }
        
        this.calculatedPrice = this.widthPriceRelativeToDrop[finalDrop][finalWidth];
      } else {
        let finalWidth: number = width;
        let finalDrop: number = drop;

        if (width in this.dropPriceRelativeToWidth) {
          finalWidth = +width;
        } else {
          const relativeWidths = Object.keys(this.dropPriceRelativeToWidth);
          for (let relativeWidth of relativeWidths) {
            if (width < +relativeWidth) {
              finalWidth = +relativeWidth;
              break;
            }
          }
        }

        if(drop in this.dropPriceRelativeToWidth[finalWidth]) {
          finalDrop = +drop;
        } else {
          const relativeDrops = Object.keys(this.dropPriceRelativeToWidth[finalWidth]);
          for(let relativeDrop of relativeDrops) {
            if(drop < +relativeDrop) {
              finalDrop = +relativeDrop;
              break;
            }
          }
        }

        this.calculatedPrice = this.dropPriceRelativeToWidth[finalWidth][finalDrop];
      }
    }
  }
}
