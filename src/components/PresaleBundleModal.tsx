import { useState } from "react";
import { X, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

interface PresaleBundleModalProps {
  open: boolean;
  onClose: () => void;
  bundleImage: string;
  presalePrice: number;
  regularPrice: number;
}

const bodyButters = [
  "Luxury Myrtille Body Butter",
  "Cool Citronella Body Butter",
  "The Gentleman Body Butter",
  "Ohh Honey Body Butter",
  "Crème Brûlée Body Butter",
  "Classic Man Body Butter",
];

const bodyScrubs = [
  "Crème Brûlée Sugar Scrub",
  "Luxury Myrtille Body Scrub",
  "Luxe Very Berry Body Scrub",
  "French Vanilla Body Scrub",
  "Good Girl Body Scrub",
  "Beach Boys Body Scrub",
  "Ohh Honey Body Scrub",
  "The Gentleman Body Scrub",
  "Classic Man Body Scrub",
];

const bathBars = [
  "Ohh Honey Bath Bar",
  "Cool Citronella Bath Bar",
  "Crème Brûlée Bath Bar",
  "The Gentleman Bath Bar",
  "Classic Man Bath Bar",
  "Beach Boys Bath Bar",
  "Good Girl Bath Bar",
  "Strawberry & Cream Bath Bar",
  "Mardi Gras Bath Bar",
];

const allJars = [
  ...bodyButters.map((name) => ({ name, category: "Body Butter" })),
  ...bodyScrubs.map((name) => ({ name, category: "Body Scrub" })),
];

const PresaleBundleModal = ({ open, onClose, bundleImage, presalePrice, regularPrice }: PresaleBundleModalProps) => {
  const { addToCart } = useCart();
  const [selectedJars, setSelectedJars] = useState<string[]>([]);
  const [selectedSoap, setSelectedSoap] = useState<string>("");

  const toggleJar = (name: string) => {
    setSelectedJars((prev) => {
      if (prev.includes(name)) return prev.filter((j) => j !== name);
      if (prev.length >= 2) {
        toast.error("You can only select 2 jars (4oz each)");
        return prev;
      }
      return [...prev, name];
    });
  };

  const handleAddToCart = () => {
    if (selectedJars.length !== 2) {
      toast.error("Please select exactly 2 jars");
      return;
    }
    if (!selectedSoap) {
      toast.error("Please select a bath bar");
      return;
    }

    const customName = `Presale Bundle: ${selectedJars.join(" + ")} + ${selectedSoap}`;
    addToCart({
      id: `presale-custom-${selectedJars.join("-")}-${selectedSoap}`.replace(/\s+/g, "-").toLowerCase(),
      name: customName,
      price: presalePrice,
      originalPrice: regularPrice,
      image: bundleImage,
      category: "Special Offer",
    });
    toast.success("Presale Bundle added to cart!");
    setSelectedJars([]);
    setSelectedSoap("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-card border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">Build Your Presale Bundle</p>
            <h2 className="font-display text-2xl font-bold text-foreground mt-1">Choose Your Products</h2>
            <p className="font-body text-xs text-muted-foreground mt-1">
              Select 2 jars (4oz) + 1 bath bar •{" "}
              <span className="text-primary font-semibold">${presalePrice}</span>{" "}
              <span className="line-through">${regularPrice}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Jar Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Choose 2 Jars <span className="font-body text-xs text-muted-foreground font-normal">(4oz each)</span>
              </h3>
              <span className="font-body text-xs text-primary font-semibold tracking-wider">
                {selectedJars.length}/2 selected
              </span>
            </div>

            {/* Body Butters */}
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-3">Body Butters</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {bodyButters.map((name) => {
                const selected = selectedJars.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleJar(name)}
                    className={`flex items-center gap-3 p-3 border text-left transition-all duration-300 ${
                      selected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 shrink-0 border flex items-center justify-center transition-all ${
                        selected ? "bg-primary border-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <Check size={12} className="text-primary-foreground" />}
                    </div>
                    <span className="font-body text-sm">{name}</span>
                  </button>
                );
              })}
            </div>

            {/* Body Scrubs */}
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-3">Body Scrubs</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bodyScrubs.map((name) => {
                const selected = selectedJars.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleJar(name)}
                    className={`flex items-center gap-3 p-3 border text-left transition-all duration-300 ${
                      selected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 shrink-0 border flex items-center justify-center transition-all ${
                        selected ? "bg-primary border-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <Check size={12} className="text-primary-foreground" />}
                    </div>
                    <span className="font-body text-sm">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Soap Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Choose 1 Bath Bar</h3>
              <span className="font-body text-xs text-primary font-semibold tracking-wider">
                {selectedSoap ? "1/1 selected" : "0/1 selected"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bathBars.map((name) => {
                const selected = selectedSoap === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedSoap(selected ? "" : name)}
                    className={`flex items-center gap-3 p-3 border text-left transition-all duration-300 ${
                      selected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center transition-all ${
                        selected ? "bg-primary border-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className="font-body text-sm">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary & Add to Cart */}
          <div className="border-t border-border pt-6">
            {(selectedJars.length > 0 || selectedSoap) && (
              <div className="mb-4 space-y-1">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-2">Your Selections</p>
                {selectedJars.map((jar) => (
                  <p key={jar} className="font-body text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles size={10} className="text-primary shrink-0" /> {jar} (4oz)
                  </p>
                ))}
                {selectedSoap && (
                  <p className="font-body text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles size={10} className="text-primary shrink-0" /> {selectedSoap}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={handleAddToCart}
              disabled={selectedJars.length !== 2 || !selectedSoap}
              className={`w-full font-body text-xs tracking-[0.2em] uppercase py-4 transition-all duration-300 ${
                selectedJars.length === 2 && selectedSoap
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {selectedJars.length === 2 && selectedSoap
                ? `Add to Cart — $${presalePrice}`
                : `Select ${2 - selectedJars.length} more jar${2 - selectedJars.length !== 1 ? "s" : ""}${!selectedSoap ? " & 1 bath bar" : ""}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresaleBundleModal;
