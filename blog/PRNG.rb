

class Card
  attr_reader :suit, :card
  def initialize(suit,card)
    @suit = suit
    @card = card
  end
end



def deck_of_cards
suits = %w[Clubs Diamonds Hearts Spades]
cards = %w[Ace 2 3 4 5 6 7 8 9 10 Jack Queen King]
  deck=[]
  for i in 0..3
    for j in 0..12
      deck << Card.new(suits[i],cards[j])
    end
  end
  return deck
end

class Dealer
  @@seed = []

  def set_seed(num=nil)
    if(num == nil)
        srand() # set seed
        saved_seed =  srand() # save seed
        @@seed << saved_seed
        srand(saved_seed) #set seed again
        return saved_seed
    else
      @@seed << num
      srand(num)
    end
  end

  def historical_seeds
    return @@seed
  end

  def deal(deck,num,seed=nil)
    set_seed(seed)
    deck.shuffle.first(num).each { |c| p "#{c.card} of #{c.suit} "}; nil
  end

end




pack = deck_of_cards
p Dealer.new.deal(pack,5)
p Dealer.new.deal(pack,5,8)
p Dealer.new.historical_seeds



