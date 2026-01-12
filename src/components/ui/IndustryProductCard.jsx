import React, { useState } from 'react';
import Button from './Button';
import Badge from './Badge';
import { postIndustryCart } from '../../services/api';
import { useToast } from '../../hooks/useToastStore.jsx';
import { Loader2 } from 'lucide-react';

const getFabricImage = (fabric) => {
  const fabricImages = {
    'Cotton': 'https://images.unsplash.com/photo-1552062407-c551eeda4921?auto=format&fit=crop&w=400&q=80',
    'Silk': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    'Wool': 'https://images.unsplash.com/photo-1601608228080-5849f45e3277?auto=format&fit=crop&w=400&q=80',
    'Polyester': 'https://images.unsplash.com/photo-1591481797696-7d71e5f9e4c9?auto=format&fit=crop&w=400&q=80',
    'Linen': 'https://images.unsplash.com/photo-1591910275545-f594145e3fc0?auto=format&fit=crop&w=400&q=80',
    'Cashmere': 'https://images.unsplash.com/photo-1570130476007-f07a92364b3b?auto=format&fit=crop&w=400&q=80',
    'Denim': 'https://images.unsplash.com/photo-1542272604-787c62d465d1?auto=format&fit=crop&w=400&q=80',
    'Leather': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80',
  };
  return fabricImages[fabric] || 'https://images.unsplash.com/photo-1572033872989-ce9175917c20?auto=format&fit=crop&w=400&q=80';
};

const IndustryProductCard = (props) => {
  const { _id, id, fabric, size, quantity, usageDuration, estimated_value, combination_id } = props;
  const productId = _id || id;
  
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);
  const { addToast } = useToast();

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setAdding(true);
      const qtyNumber = Number(qty) && !isNaN(Number(qty)) ? Math.max(1, Number(qty)) : 1;
      const estVal = Number(estimated_value) && !isNaN(Number(estimated_value)) ? Number(estimated_value) : 0;
      const amount = estVal * qtyNumber;

      const payload = {
        id: productId,
        combination_id: productId,
        fabric,
        size,
        quantity: qtyNumber,
        usageDuration,
        estimated_value: estVal,
        amount
      };

      await postIndustryCart(payload);
      
      // Show success toast
      addToast(`Added ${qtyNumber}x ${fabric} (${size}) to cart`, 'success');
      
      // Dispatch event for cart page to listen
      try {
        window.dispatchEvent(new CustomEvent('industryCartUpdated', { detail: { id: productId, quantity: qtyNumber } }));
      } catch (evErr) {
        console.warn('Could not dispatch industryCartUpdated event', evErr);
      }
    } catch (err) {
      addToast(err.message || 'Failed to add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl border-2 border-border bg-card p-0 rounded-lg flex flex-col h-full">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center">
        <img
          src={getFabricImage(fabric)}
          alt={fabric}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-3 right-3 bg-blue-600 text-white">
          {size}
        </Badge>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-semibold text-base leading-tight text-card-foreground mb-1">{fabric}</h3>
        
        <div className="text-xs text-muted-foreground mb-3 space-y-1">
          <p>Usage: <span className="font-medium text-foreground">{usageDuration ? `${usageDuration} months` : '—'}</span></p>
          {quantity && <p>Available: <span className="font-medium text-foreground">{quantity}</span></p>}
        </div>

        <div className="flex items-center gap-2 mb-4 mt-auto">
          <div className="text-xs text-muted-foreground">Est. Value</div>
          <div className="text-lg font-bold text-primary">₹{estimated_value ? estimated_value.toLocaleString() : 'N/A'}</div>
        </div>

        {/* Quantity Input */}
        <div className="flex items-center gap-2 mb-3">
          <label className="text-xs text-muted-foreground">Qty</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            className="w-16 text-sm rounded-md border px-2 py-1 bg-background"
          />
        </div>

        {/* Add Button */}
        <Button 
          size="sm" 
          onClick={handleAdd} 
          disabled={adding} 
          className="w-full"
        >
          {adding ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            'Add to Cart'
          )}
        </Button>
      </div>
    </div>
  );
};

export default IndustryProductCard;
